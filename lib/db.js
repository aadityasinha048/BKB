import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { MongoClient } from 'mongodb';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Data Abstraction Layer for Bihar Ka Bazaar
 * 
 * Supports a Hybrid Backend:
 * - MongoDB (preferred production database when MONGODB_URI is set)
 * - Firebase Firestore (secondary production database when credentials are set)
 * - JSON flat files in /data directory (as fallback for local dev)
 */

const DATA_DIR = path.join(process.cwd(), 'data');
const collectionLocks = new Map();
let firestoreDb = null;
let hasLoggedWarning = false;

// ─── MongoDB Client Connection Pooling ───────────────────────

let mongoClient = null;
let mongoClientPromise = null;
let mongoDb = null;

export async function getMongoDb() {
  if (mongoDb) return mongoDb;

  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  try {
    if (!mongoClientPromise) {
      if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClientPromise) {
          mongoClient = new MongoClient(uri);
          global._mongoClientPromise = mongoClient.connect();
        }
        mongoClientPromise = global._mongoClientPromise;
      } else {
        mongoClient = new MongoClient(uri);
        mongoClientPromise = mongoClient.connect();
      }
    }
    const client = await mongoClientPromise;
    mongoDb = client.db();
    return mongoDb;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB, falling back:", error);
    return null;
  }
}

// ─── Firebase Admin SDK Initialization ──────────────────────

export function getFirestoreDb() {
  if (firestoreDb) return firestoreDb;

  try {
    const apps = getApps();
    let app;
    if (apps.length > 0) {
      app = apps[0];
    } else {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (!projectId || !clientEmail || !privateKey) {
        if (!hasLoggedWarning) {
          console.warn("⚠️ Firebase Admin credentials not fully configured. Falling back to local JSON flat-file storage.");
          hasLoggedWarning = true;
        }
        return null;
      }

      app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    }
    firestoreDb = getFirestore(app);
    return firestoreDb;
  } catch (error) {
    if (!hasLoggedWarning) {
      console.error("❌ Failed to initialize Firestore SDK, falling back to JSON files:", error);
      hasLoggedWarning = true;
    }
    return null;
  }
}

// ─── Lock Utility for JSON Fallback & Mutators ────────────────

function getCollectionPath(name) {
  if (!/^[a-z0-9_-]+$/i.test(name)) {
    throw new Error(`Invalid collection name: ${name}`);
  }
  return path.join(DATA_DIR, `${name}.json`);
}

async function withCollectionLock(collection, operation) {
  const previous = collectionLocks.get(collection) || Promise.resolve();
  let release;
  const current = new Promise(resolve => {
    release = resolve;
  });

  const queued = previous.then(() => current);
  collectionLocks.set(collection, queued);

  await previous;
  try {
    return await operation();
  } finally {
    release();
    if (collectionLocks.get(collection) === queued) {
      collectionLocks.delete(collection);
    }
  }
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

// ─── Core Read/Write ────────────────────────────────────────

/**
 * Read a full collection.
 * @param {string} name - Collection name (e.g. 'sellers', 'prelaunch')
 * @returns {Promise<Array>} The array of documents
 */
export async function readCollection(name) {
  // 1. Try MongoDB
  const mdb = await getMongoDb();
  if (mdb) {
    try {
      const items = await mdb.collection(name).find({}).toArray();
      const mapped = items.map(item => {
        const { _id, ...rest } = item;
        return rest;
      });
      if (name === 'products') {
        mapped.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
      }
      return mapped;
    } catch (error) {
      console.error(`MongoDB read error on collection "${name}":`, error);
      return [];
    }
  }

  // 2. Try Firestore
  const db = getFirestoreDb();
  if (db) {
    try {
      const snapshot = await db.collection(name).get();
      const items = [];
      snapshot.forEach(doc => {
        items.push(doc.data());
      });
      if (name === 'products') {
        items.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
      }
      return items;
    } catch (error) {
      console.error(`Firestore read error on collection "${name}":`, error);
      return [];
    }
  }

  // 3. Fallback to JSON
  const filePath = getCollectionPath(name);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(`Failed to read collection "${name}":`, error);
    }
    return [];
  }
}

/**
 * Write a full collection.
 * @param {string} name - Collection name
 * @param {Array} data - The full array to write
 */
export async function writeCollection(name, data) {
  if (!Array.isArray(data)) {
    throw new Error(`Collection "${name}" must be written as an array.`);
  }

  // 1. Try MongoDB
  const mdb = await getMongoDb();
  if (mdb) {
    try {
      const col = mdb.collection(name);
      await col.deleteMany({});
      if (data.length > 0) {
        await col.insertMany(data);
      }
      return;
    } catch (error) {
      console.error(`MongoDB write error on collection "${name}":`, error);
      throw error;
    }
  }

  // 2. Try Firestore
  const db = getFirestoreDb();
  if (db) {
    try {
      const existingSnapshot = await db.collection(name).get();
      const existingIds = new Set(existingSnapshot.docs.map(d => d.id));
      const newIds = new Set(data.map(d => String(d.id)));

      const ops = [];
      for (const doc of data) {
        const docId = String(doc.id);
        ops.push({ type: 'set', ref: db.collection(name).doc(docId), data: doc });
      }
      for (const id of existingIds) {
        if (!newIds.has(id)) {
          ops.push({ type: 'delete', ref: db.collection(name).doc(id) });
        }
      }

      const CHUNK_SIZE = 400;
      for (let i = 0; i < ops.length; i += CHUNK_SIZE) {
        const chunk = ops.slice(i, i + CHUNK_SIZE);
        const batch = db.batch();
        for (const op of chunk) {
          if (op.type === 'set') {
            batch.set(op.ref, op.data);
          } else if (op.type === 'delete') {
            batch.delete(op.ref);
          }
        }
        await batch.commit();
      }
      return;
    } catch (error) {
      console.error(`Firestore write error on collection "${name}":`, error);
      throw error;
    }
  }

  // 3. Fallback to JSON
  await ensureDataDir();
  const filePath = getCollectionPath(name);
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tempPath, filePath);
}

export async function mutateCollection(collection, mutator) {
  return withCollectionLock(collection, async () => {
    const data = await readCollection(collection);
    const result = await mutator(data);
    await writeCollection(collection, data);
    return result;
  });
}

// ─── Document Operations ────────────────────────────────────

/**
 * Find a single document by a field value.
 * @param {string} collection - Collection name
 * @param {string} field - Field to match
 * @param {*} value - Value to match
 * @returns {Promise<Object|null>}
 */
export async function findOne(collection, field, value) {
  // 1. Try MongoDB
  const mdb = await getMongoDb();
  if (mdb) {
    try {
      const item = await mdb.collection(collection).findOne({ [field]: value });
      if (!item) return null;
      const { _id, ...rest } = item;
      return rest;
    } catch (error) {
      console.error(`MongoDB findOne error on "${collection}":`, error);
      return null;
    }
  }

  // 2. Try Firestore
  const db = getFirestoreDb();
  if (db) {
    try {
      if (field === 'id') {
        const docRef = db.collection(collection).doc(String(value));
        const docSnap = await docRef.get();
        return docSnap.exists ? docSnap.data() : null;
      }
      const snapshot = await db.collection(collection).where(field, '==', value).limit(1).get();
      if (snapshot.empty) return null;
      return snapshot.docs[0].data();
    } catch (error) {
      console.error(`Firestore findOne error on "${collection}":`, error);
      return null;
    }
  }

  // 3. Fallback to JSON
  const data = await readCollection(collection);
  return data.find(doc => doc[field] === value) || null;
}

/**
 * Find all documents matching a filter function.
 * @param {string} collection - Collection name
 * @param {Function} filterFn - Filter predicate
 * @returns {Promise<Array>}
 */
export async function findMany(collection, filterFn = () => true) {
  const data = await readCollection(collection);
  return data.filter(filterFn);
}

/**
 * Insert a new document into a collection.
 * @param {string} collection - Collection name
 * @param {Object} doc - Document to insert
 * @returns {Promise<Object>} The inserted document
 */
export async function insertOne(collection, doc) {
  // 1. Try MongoDB
  const mdb = await getMongoDb();
  if (mdb) {
    try {
      const clone = { ...doc };
      if (!clone.id) {
        clone.id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
      }
      await mdb.collection(collection).insertOne(clone);
      const { _id, ...rest } = clone;
      return rest;
    } catch (error) {
      console.error(`MongoDB insertOne error on "${collection}":`, error);
      throw error;
    }
  }

  // 2. Try Firestore
  const db = getFirestoreDb();
  if (db) {
    try {
      let docId = doc.id ? String(doc.id) : null;
      if (!docId) {
        const docRef = db.collection(collection).doc();
        docId = docRef.id;
        doc.id = docId;
        await docRef.set(doc);
      } else {
        await db.collection(collection).doc(docId).set(doc);
      }
      return doc;
    } catch (error) {
      console.error(`Firestore insertOne error on "${collection}":`, error);
      throw error;
    }
  }

  // 3. Fallback to JSON
  return withCollectionLock(collection, async () => {
    const data = await readCollection(collection);
    data.push(doc);
    await writeCollection(collection, data);
    return doc;
  });
}

/**
 * Update a document by matching a field value.
 * @param {string} collection - Collection name
 * @param {string} field - Field to match
 * @param {*} value - Value to match
 * @param {Object} updates - Fields to merge
 * @returns {Promise<Object|null>} Updated document or null
 */
export async function updateOne(collection, field, value, updates) {
  // 1. Try MongoDB
  const mdb = await getMongoDb();
  if (mdb) {
    try {
      const col = mdb.collection(collection);
      const cleanUpdates = { ...updates };
      delete cleanUpdates._id;

      await col.updateOne({ [field]: value }, { $set: cleanUpdates });
      const updated = await col.findOne({ [field]: value });
      if (!updated) return null;
      const { _id, ...rest } = updated;
      return rest;
    } catch (error) {
      console.error(`MongoDB updateOne error on "${collection}":`, error);
      throw error;
    }
  }

  // 2. Try Firestore
  const db = getFirestoreDb();
  if (db) {
    try {
      if (field === 'id') {
        const docId = String(value);
        const docRef = db.collection(collection).doc(docId);
        const docSnap = await docRef.get();
        if (!docSnap.exists) return null;
        await docRef.update(updates);
        const updatedSnap = await docRef.get();
        return updatedSnap.data();
      } else {
        const snapshot = await db.collection(collection).where(field, '==', value).limit(1).get();
        if (snapshot.empty) return null;
        const docRef = snapshot.docs[0].ref;
        await docRef.update(updates);
        const updatedSnap = await docRef.get();
        return updatedSnap.data();
      }
    } catch (error) {
      console.error(`Firestore updateOne error on "${collection}":`, error);
      throw error;
    }
  }

  // 3. Fallback to JSON
  return withCollectionLock(collection, async () => {
    const data = await readCollection(collection);
    const index = data.findIndex(doc => doc[field] === value);
    if (index === -1) return null;

    data[index] = { ...data[index], ...updates };
    await writeCollection(collection, data);
    return data[index];
  });
}

/**
 * Delete a document by matching a field value.
 * @param {string} collection - Collection name
 * @param {string} field - Field to match
 * @param {*} value - Value to match
 * @returns {Promise<boolean>} True if deleted
 */
export async function deleteOne(collection, field, value) {
  // 1. Try MongoDB
  const mdb = await getMongoDb();
  if (mdb) {
    try {
      const result = await mdb.collection(collection).deleteOne({ [field]: value });
      return result.deletedCount > 0;
    } catch (error) {
      console.error(`MongoDB deleteOne error on "${collection}":`, error);
      return false;
    }
  }

  // 2. Try Firestore
  const db = getFirestoreDb();
  if (db) {
    try {
      if (field === 'id') {
        const docId = String(value);
        const docRef = db.collection(collection).doc(docId);
        const docSnap = await docRef.get();
        if (!docSnap.exists) return false;
        await docRef.delete();
        return true;
      } else {
        const snapshot = await db.collection(collection).where(field, '==', value).limit(1).get();
        if (snapshot.empty) return false;
        await snapshot.docs[0].ref.delete();
        return true;
      }
    } catch (error) {
      console.error(`Firestore deleteOne error on "${collection}":`, error);
      return false;
    }
  }

  // 3. Fallback to JSON
  return withCollectionLock(collection, async () => {
    const data = await readCollection(collection);
    const index = data.findIndex(doc => doc[field] === value);
    if (index === -1) return false;

    data.splice(index, 1);
    await writeCollection(collection, data);
    return true;
  });
}

/**
 * Delete all documents matching a filter function.
 * @param {string} collection - Collection name
 * @param {Function} filterFn - Documents matching this will be REMOVED
 * @returns {Promise<number>} Number of deleted documents
 */
export async function deleteMany(collection, filterFn) {
  // 1. Try MongoDB
  const mdb = await getMongoDb();
  if (mdb) {
    try {
      const data = await readCollection(collection);
      const toDelete = data.filter(filterFn);
      if (toDelete.length === 0) return 0;

      const ids = toDelete.map(doc => doc.id);
      const result = await mdb.collection(collection).deleteMany({ id: { $in: ids } });
      return result.deletedCount;
    } catch (error) {
      console.error(`MongoDB deleteMany error on "${collection}":`, error);
      throw error;
    }
  }

  // 2. Try Firestore
  const db = getFirestoreDb();
  if (db) {
    try {
      const data = await readCollection(collection);
      const toDelete = data.filter(filterFn);
      if (toDelete.length === 0) return 0;

      const ops = toDelete.map(doc => ({
        type: 'delete',
        ref: db.collection(collection).doc(String(doc.id))
      }));

      const CHUNK_SIZE = 400;
      for (let i = 0; i < ops.length; i += CHUNK_SIZE) {
        const chunk = ops.slice(i, i + CHUNK_SIZE);
        const batch = db.batch();
        for (const op of chunk) {
          batch.delete(op.ref);
        }
        await batch.commit();
      }
      return toDelete.length;
    } catch (error) {
      console.error(`Firestore deleteMany error on "${collection}":`, error);
      throw error;
    }
  }

  // 3. Fallback to JSON
  return withCollectionLock(collection, async () => {
    const data = await readCollection(collection);
    const remaining = data.filter(doc => !filterFn(doc));
    const deletedCount = data.length - remaining.length;
    await writeCollection(collection, remaining);
    return deletedCount;
  });
}

/**
 * Count documents in a collection, optionally filtered.
 * @param {string} collection - Collection name
 * @param {Function} filterFn - Optional filter predicate
 * @returns {Promise<number>}
 */
export async function count(collection, filterFn = () => true) {
  // 1. Try MongoDB
  const mdb = await getMongoDb();
  if (mdb) {
    try {
      const filterStr = filterFn.toString();
      const isDefaultFilter = filterStr.includes('=> true') || filterStr.includes('() => true');
      if (isDefaultFilter) {
        return await mdb.collection(collection).countDocuments();
      }
      const data = await readCollection(collection);
      return data.filter(filterFn).length;
    } catch (error) {
      console.error(`MongoDB count error on "${collection}":`, error);
      return 0;
    }
  }

  // 2. Try Firestore
  const db = getFirestoreDb();
  if (db) {
    try {
      const filterStr = filterFn.toString();
      const isDefaultFilter = filterStr.includes('=> true') || filterStr.includes('() => true');
      if (isDefaultFilter) {
        const snapshot = await db.collection(collection).count().get();
        return snapshot.data().count;
      }
      const data = await readCollection(collection);
      return data.filter(filterFn).length;
    } catch (error) {
      console.error(`Firestore count error on "${collection}":`, error);
      return 0;
    }
  }

  // 3. Fallback to JSON
  const data = await readCollection(collection);
  return data.filter(filterFn).length;
}
