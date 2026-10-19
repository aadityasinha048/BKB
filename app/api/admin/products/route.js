import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { readCollection, mutateCollection } from '@/lib/db';

async function logAction(action, details) {
  try {
    await mutateCollection('logs', async logs => {
      logs.unshift({
        id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        action,
        details,
      });
      if (logs.length > 300) logs.splice(300);
    });
  } catch (err) {
    console.error('Failed to log admin action:', err);
  }
}

export async function GET(request) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return NextResponse.json({ success: false, error: authError.error }, { status: authError.status });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    const products = await readCollection('products');

    const stats = {
      total: products.length,
      active: products.filter(p => !p.outOfStock && !p.isHidden && p.status !== 'out_of_stock' && p.status !== 'hidden').length,
      outOfStock: products.filter(p => p.outOfStock || p.status === 'out_of_stock').length,
      hidden: products.filter(p => p.isHidden || p.status === 'hidden').length,
      giCertified: products.filter(p => Boolean(p.gi || p.giTag || p.giCertified)).length
    };

    let filtered = products;

    if (search) {
      filtered = filtered.filter(p =>
        (p.name && p.name.toLowerCase().includes(search)) ||
        (p.seller && p.seller.toLowerCase().includes(search)) ||
        (p.category && p.category.toLowerCase().includes(search)) ||
        (p.origin && p.origin.toLowerCase().includes(search))
      );
    }

    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== 'All') {
      if (status === 'out_of_stock') {
        filtered = filtered.filter(p => p.outOfStock || p.status === 'out_of_stock');
      } else if (status === 'hidden') {
        filtered = filtered.filter(p => p.isHidden || p.status === 'hidden');
      } else if (status === 'active') {
        filtered = filtered.filter(p => !p.outOfStock && !p.isHidden && p.status !== 'out_of_stock' && p.status !== 'hidden');
      } else if (status === 'gi' || status === 'gi_certified') {
        filtered = filtered.filter(p => Boolean(p.gi || p.giTag || p.giCertified));
      }
    }

    return NextResponse.json({
      success: true,
      products: filtered,
      stats
    });
  } catch (error) {
    console.error('Admin Products GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch catalog.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return NextResponse.json({ success: false, error: authError.error }, { status: authError.status });
    }

    const body = await request.json();
    const { productId, outOfStock, isHidden, giCertified, giTag, gi, price, featured } = body;

    if (!productId) {
      return NextResponse.json({ success: false, error: 'productId is required.' }, { status: 400 });
    }

    let updatedProduct = null;

    await mutateCollection('products', async products => {
      const idx = products.findIndex(p => String(p.id) === String(productId));
      if (idx === -1) {
        throw new Error('Product not found in catalog');
      }

      if (outOfStock !== undefined) {
        products[idx].outOfStock = outOfStock;
        products[idx].status = outOfStock ? 'out_of_stock' : (products[idx].isHidden ? 'hidden' : 'active');
      }
      if (isHidden !== undefined) {
        products[idx].isHidden = isHidden;
        products[idx].status = isHidden ? 'hidden' : (products[idx].outOfStock ? 'out_of_stock' : 'active');
      }
      if (giCertified !== undefined || gi !== undefined || giTag !== undefined) {
        const isGiVal = Boolean(giCertified !== undefined ? giCertified : (gi !== undefined ? gi : giTag));
        products[idx].gi = isGiVal;
        products[idx].giTag = isGiVal;
        products[idx].giCertified = isGiVal;
      }
      if (price !== undefined) {
        products[idx].price = Number(price);
      }
      if (featured !== undefined) {
        products[idx].featured = featured;
      }

      updatedProduct = products[idx];
    });

    await logAction('UPDATE_PRODUCT_CATALOG', `Catalog edit on product #${productId} (${updatedProduct.name}, GI: ${updatedProduct.gi})`);

    return NextResponse.json({
      success: true,
      message: 'Product catalog updated.',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Admin Products PUT error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update product.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return NextResponse.json({ success: false, error: authError.error }, { status: authError.status });
    }

    const body = await request.json();
    const { name, category, price, seller, origin, description, giTag, gi, giCertified, image } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ success: false, error: 'Name, price and category are required.' }, { status: 400 });
    }

    const isGiInitial = Boolean(giTag || gi || giCertified);

    const newProduct = {
      id: String(Date.now()),
      name: name.trim(),
      category: category.trim(),
      cat: category.trim(),
      price: Number(price),
      originalPrice: Number(price) + 200,
      seller: seller ? seller.trim() : 'Bihar Ka Bazaar Artisan',
      origin: origin ? origin.trim() : 'Bihar',
      description: description ? description.trim() : '',
      gi: isGiInitial,
      giTag: isGiInitial,
      giCertified: isGiInitial,
      image: image || '/images/products/prod_1.png',
      imgSrc: image || '/images/products/prod_1.png',
      status: 'active',
      outOfStock: false,
      isHidden: false,
      rating: 4.8,
      reviews: 0,
      createdAt: new Date().toISOString()
    };

    await mutateCollection('products', async products => {
      products.unshift(newProduct);
    });

    await logAction('CREATE_PRODUCT', `Admin created catalog item: ${newProduct.name}`);

    return NextResponse.json({
      success: true,
      message: 'Product published to catalog successfully.',
      product: newProduct
    });
  } catch (error) {
    console.error('Admin Products POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const authError = await requireAdmin(request);
    if (authError) {
      return NextResponse.json({ success: false, error: authError.error }, { status: authError.status });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ success: false, error: 'productId is required.' }, { status: 400 });
    }

    await mutateCollection('products', async products => {
      const idx = products.findIndex(p => String(p.id) === String(productId));
      if (idx !== -1) {
        products.splice(idx, 1);
      }
    });

    await logAction('DELETE_PRODUCT', `Admin deleted catalog item #${productId}`);

    return NextResponse.json({
      success: true,
      message: 'Product removed from catalog.'
    });
  } catch (error) {
    console.error('Admin Products DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete product.' }, { status: 500 });
  }
}

