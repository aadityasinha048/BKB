import { NextResponse } from 'next/server';
import { findOne, mutateCollection, readCollection } from '@/lib/db';
import { cleanImageSource, cleanString, cleanText, publicSeller } from '@/lib/validation';

// GET — Retrieve all products, optionally filtered by sellerId or category
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    const cat = searchParams.get('cat');

    let products = await readCollection('products');

    if (sellerId) {
      products = products.filter(p => p.sellerId === sellerId);
    }

    if (cat) {
      // Handle simple category mapping if query matches
      const categoryMapping = {
        'Food & Agri': 'Food & Agri',
        'Handicrafts': 'Handicrafts',
        'Textiles': 'Textiles',
        'Fruits': 'Fruits',
        'Sweets': 'Sweets'
      };
      const cleanCat = categoryMapping[cat] || cat;
      products = products.filter(p => p.cat.toLowerCase().includes(cleanCat.toLowerCase()));
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Products GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}

// POST — Add a new product (restricted/mock verification via sellerId)
export async function POST(request) {
  try {
    const body = await request.json();
    const name = cleanString(body.name, 140);
    const seller = cleanString(body.seller, 120);
    const dist = cleanString(body.dist, 80);
    const cat = cleanString(body.cat, 80);
    const price = Number(body.price);
    const unit = cleanString(body.unit, 40);
    const imgSrc = cleanImageSource(body.imgSrc, '/images/products/prod_12.png');
    const desc = cleanText(body.desc);
    const sellerId = cleanString(body.sellerId, 80);
    const variants = Array.isArray(body.variants) ? body.variants.slice(0, 20) : [];
    const images = Array.isArray(body.images)
      ? body.images.map(src => cleanImageSource(src)).filter(Boolean).slice(0, 8)
      : [];

    if (!name || !seller || !dist || !cat || !Number.isFinite(price) || price <= 0 || !unit || !desc || !sellerId) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      );
    }

    const sellerRecord = await findOne('sellers', 'id', sellerId);
    if (!publicSeller(sellerRecord)) {
      return NextResponse.json(
        { success: false, error: 'Seller account not found.' },
        { status: 404 }
      );
    }

    const newProduct = await mutateCollection('products', async products => {
      const newId = products.length > 0 ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1;
      const product = {
        id: newId,
        name,
        seller,
        dist,
        cat,
        price,
        unit,
        imgSrc,
        gi: false,
        rat: "5.0",
        rev: 0,
        bg: '#FFF8F2',
        desc,
        sellerId,
        variants,
        images
      };

      products.push(product);
      return product;
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Products POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}
