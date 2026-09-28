import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

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

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ Error: MONGODB_URI not configured in env variables.');
    console.error('Please configure MONGODB_URI in .env.local (e.g. MONGODB_URI=mongodb://localhost:27017/bkb).');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB successfully.');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }

  const db = client.db();
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

      // Clean existing items in collection first
      await db.collection(col).deleteMany({});

      // Insert all
      await db.collection(col).insertMany(data);
      console.log(`✅ Successfully seeded collection "${col}"`);
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log(`ℹ️ Collection file for "${col}" not found, skipping.`);
      } else {
        console.error(`❌ Error seeding collection "${col}":`, err);
      }
    }
  }

  await client.close();
  console.log('\n🎉 Database seeding and migration completed successfully!');
}

run();
