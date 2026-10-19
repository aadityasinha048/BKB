import fs from 'fs/promises';
import { MongoClient } from 'mongodb';

async function main() {
  const samplePackVideo = {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    fileName: 'BKB-ORD-902411_box_packaging_360.mp4',
    fileSize: '14.2 MB',
    uploadedAt: '2026-10-01T11:30:00.000Z',
    status: 'verified',
    notes: 'Full 360° box recording. Handcrafted Madhubani painting packed with bubble cushioning and sealed with tamper-proof BKB tape.',
    checklist: {
      allProductsVisible: true,
      boxInteriorAndCushioningVisible: true,
      fullBox360Recorded: true,
      shippingLabelAndSealVisible: true
    }
  };

  try {
    const localOrders = JSON.parse(await fs.readFile('./data/orders.json', 'utf8'));
    const target = localOrders.find(o => o.id === 'BKB-ORD-902411');
    if (target) {
      target.packagingVideo = samplePackVideo;
      await fs.writeFile('./data/orders.json', JSON.stringify(localOrders, null, 2));
      console.log('Updated order in data/orders.json');
    }
  } catch (e) {
    console.warn('JSON file update note:', e.message);
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bkb';
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db();
    await db.collection('orders').updateOne(
      { id: 'BKB-ORD-902411' },
      { $set: { packagingVideo: samplePackVideo } }
    );
    console.log('Updated order in Mongo with packagingVideo');
    await client.close();
  } catch (err) {
    console.warn('Mongo update note:', err.message);
  }
}

main();
