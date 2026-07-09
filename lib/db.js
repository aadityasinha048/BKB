import fs from 'fs/promises';
import path from 'path';

/**
 * Data Abstraction Layer for Bihar Ka Bazaar
 * 
 * All data operations go through this module.
 * Currently uses JSON flat files in /data directory.
 * 
 * To migrate to MongoDB/PostgreSQL later:
 *   1. Replace the internals of these functions
 *   2. Keep the same function signatures
 *   3. Zero changes needed in API routes
 */

const DATA_DIR = path.join(process.cwd(), 'data');
const collectionLocks = new Map();

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

// ─── Core Read/Write ────────────────────────────────────────

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

/**
 * Read a full collection from disk.
 * @param {string} name - Collection name (e.g. 'sellers', 'prelaunch', 'sessions')
 * @returns {Promise<Array>} The array of documents
 */
export async function readCollection(name) {
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
 * Write a full collection to disk.
 * @param {string} name - Collection name
 * @param {Array} data - The full array to write
 */
export async function writeCollection(name, data) {
  if (!Array.isArray(data)) {
    throw new Error(`Collection "${name}" must be written as an array.`);
  }
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
  const data = await readCollection(collection);
  return data.filter(filterFn).length;
}
