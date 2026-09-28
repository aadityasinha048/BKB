import { NextResponse } from 'next/server';
import { findOne, mutateCollection, readCollection } from '@/lib/db';
import { cleanImageSource, cleanString, cleanText, publicSeller } from '@/lib/validation';
import { requireAdmin } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';

// GET - Retrieve all products, optionally filtered by sellerId or category
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
      const cleanCat = cleanString(cat, 80).toLowerCase();
      products = products.filter(p => (p.cat || '').toLowerCase().includes(cleanCat));
    }
    // Pagination (default: page 1, limit 50)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
    const total = products.length;
    const paginated = products.slice((page - 1) * limit, page * limit);

    return NextResponse.json({ success: true, products: paginated, total, page, limit });
  } catch (error) {
    console.error('Products GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}

// POST - Add a new product (requires admin or authenticated seller)
export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
      || request.headers.get('x-real-ip')
      || '127.0.0.1';
    const limitCheck = await rateLimit(ip, 'products-post', 10, 60 * 1000);
    if (!limitCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const sellerId = cleanString(body.sellerId, 80);

    // Auth check: Either valid admin session OR registered seller account
    const authHeader = request.headers.get('authorization');
    let isAuthorized = false;

    if (authHeader) {
      const authError = await requireAdmin(request);
      if (!authError) {
        isAuthorized = true;
      }
    }

    let sellerRecord = null;
    if (sellerId) {
      sellerRecord = await findOne('sellers', 'id', sellerId);
      if (sellerRecord) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please log in as a registered seller.' },
        { status: 401 }
      );
    }

    const name = cleanString(body.name, 140);
    const seller = cleanString(body.seller || sellerRecord?.fullName, 120);
    const dist = cleanString(body.dist || sellerRecord?.district || 'Bihar', 80);
    const cat = cleanString(body.cat, 80);
    const price = Number(body.price);
    const unit = cleanString(body.unit, 40);
    const imgSrc = cleanImageSource(body.imgSrc, '/images/products/prod_12.png');
    const desc = cleanText(body.desc);
    const variants = Array.isArray(body.variants) ? body.variants.slice(0, 20) : [];
    const images = Array.isArray(body.images)
      ? body.images.map(src => cleanImageSource(src)).filter(Boolean).slice(0, 8)
      : [];

    if (!name || !seller || !dist || !cat || !Number.isFinite(price) || price <= 0 || !unit || !desc) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
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
