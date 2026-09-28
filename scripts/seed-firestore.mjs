import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to manually load env variables from .env.local
async function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  try {
    const content = await fs.readFile(envPath, 'utf-8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const index = trimmed.indexOf('=');
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      let val = trimmed.slice(index + 1).trim();
      // Strip optional enclosing quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
    console.log('✅ Loaded environment variables from .env.local');
  } catch (err) {
    console.warn('⚠️ No .env.local file found or failed to read it. Using system env.');
  }
}

async function run() {
  await loadEnv();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.error('❌ Error: Firebase Admin credentials not fully configured in env variables.');
    console.error('Please configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local.');
    process.exit(1);
  }

  console.log('Initializing Firebase Admin SDK...');
  const app = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });

  const db = getFirestore(app);
  const dataDir = path.join(__dirname, '..', 'data');
  const collections = ['products', 'sellers', 'prelaunch', 'sessions', 'logs'];

  for (const col of collections) {
    const filePath = path.join(dataDir, `${col}.json`);
    console.log(`Processing collection "${col}" from ${filePath}...`);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);

      if (!Array.isArray(data)) {
        console.warn(`⚠️ Collection "${col}" is not an array, skipping.`);
        continue;
      }

      if (data.length === 0) {
        console.log(`ℹ️ Collection "${col}" is empty, skipping.`);
        continue;
      }

      console.log(`Uploading ${data.length} documents to collection "${col}"...`);
      
      // Split uploads into batches of 400 to avoid Firestore limits
      const CHUNK_SIZE = 400;
      for (let i = 0; i < data.length; i += CHUNK_SIZE) {
        const chunk = data.slice(i, i + CHUNK_SIZE);
        const batch = db.batch();
        
        for (const item of chunk) {
          if (!item.id) {
            console.warn(`⚠️ Item missing "id" field in "${col}", skipping:`, item);
            continue;
          }
          const docId = String(item.id);
          const docRef = db.collection(col).doc(docId);
          batch.set(docRef, item);
        }
        
        await batch.commit();
        console.log(`  Committed batch of ${chunk.length} documents to "${col}"`);
      }

      console.log(`✅ Successfully seeded collection "${col}"`);
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log(`ℹ️ Collection file for "${col}" not found, skipping.`);
      } else {
        console.error(`❌ Error seeding collection "${col}":`, err);
      }
    }
  }

  console.log('\n🎉 Database seeding completed successfully!');
}

run();
