'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Tag, Image as ImageIcon, CheckCircle, HelpCircle } from 'lucide-react';

const PRODUCT_IMAGES = [
  { label: "Makhana (Fox Nuts)", url: "/images/products/prod_1.png" },
  { label: "Madhubani Painting", url: "/images/products/prod_2.png" },
  { label: "Tussar Silk Saree", url: "/images/products/prod_3.png" },
  { label: "Shahi Litchi", url: "/images/products/prod_4.png" },
  { label: "Silao Khaja", url: "/images/products/prod_5.png" },
  { label: "Katarni Rice", url: "/images/products/prod_6.png" },
  { label: "Jardalu Mango", url: "/images/products/prod_7.png" },
  { label: "Mango Pickle", url: "/images/products/prod_9.png" },
  { label: "Tikuli Art Piece", url: "/images/products/prod_10.png" },
  { label: "Litchi Juice", url: "/images/products/prod_11.png" },
  { label: "Sikki Grass Basket", url: "/images/products/prod_12.png" },
];

export default function AddProductPage() {
  const router = useRouter();
  const [seller, setSeller] = useState(null);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState('Food & Agri');
  const [imagesList, setImagesList] = useState([]);
  const [selectedImg, setSelectedImg] = useState('');
  const [variants, setVariants] = useState([
    { weight: '500g', price: '', stock: '100' }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addImageToList = (url) => {
    if (imagesList.length >= 4) {
      setError("You can add up to 4 photos for the product.");
      return;
    }
    if (!imagesList.includes(url)) {
      setImagesList(prev => [...prev, url]);
      setSelectedImg(url);
    }
  };

  const removeImageFromList = (index) => {
    const updated = imagesList.filter((_, i) => i !== index);
    setImagesList(updated);
    if (updated.length > 0) {
      setSelectedImg(updated[0]);
    } else {
      setSelectedImg('');
    }
  };

  const updateVariant = (index, field, value) => {
    setVariants(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addVariant = () => {
    setVariants(prev => [...prev, { weight: '', price: '', stock: '100' }]);
  };

  const removeVariant = (index) => {
    if (variants.length > 1) {
      setVariants(prev => prev.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    const storedId = localStorage.getItem('bkb_seller_id');
    if (!storedId) {
      router.replace('/login?role=seller');
    } else {
      fetchSeller(storedId);
    }
  }, [router]);

  const fetchSeller = async (id) => {
    try {
      const res = await fetch(`/api/register-seller?sellerId=${id}`);
      const data = await res.json();
      if (data.success) {
        setSeller(data.seller);
        setCheckedAuth(true);
      } else {
        localStorage.removeItem('bkb_seller_id');
        router.replace('/login?role=seller');
      }
    } catch {
      router.replace('/login?role=seller');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        addImageToList(event.target.result);
      };
      reader.onerror = () => {
        setError("Failed to read image file.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !desc.trim() || variants.some(v => !v.weight.trim() || !v.price.trim())) {
      setError('Please fill in all fields for at least one weight option.');
      return;
    }

    if (imagesList.length === 0) {
      setError('Please select or upload at least one product photo.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          seller: seller.fullName,
          dist: seller.district || 'Bihar',
          cat,
          price: parseFloat(variants[0].price),
          unit: variants[0].weight,
          imgSrc: imagesList[0] || selectedImg,
          desc: desc.trim(),
          sellerId: seller.id,
          variants: variants.map(v => ({
            weight: v.weight.trim(),
            price: parseFloat(v.price),
            stock: parseInt(v.stock) || 0
          })),
          images: imagesList.length > 0 ? imagesList : [selectedImg]
        })
      });
      const result = await response.json();

      if (result.success) {
        // Change status to Products Added
        await fetch(`/api/register-seller`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sellerId: seller.id,
            category: cat,
            productDescription: desc.trim()
          })
        });

        setSubmitted(true);
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        setError(result.error || 'Failed to list product. Please try again.');
      }
    } catch (err) {
      setError('Network error listing product.');
    } finally {
      setLoading(false);
    }
  };

  if (!checkedAuth) {
    return (
      <div style={{ background: '#FFFCF8', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: 16, color: '#8C7B6E', fontWeight: 600 }}>Loading setup panel...</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#FFFCF8', minHeight: '80vh' }}>
      
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8DDD4', padding: '20px 60px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '8px 16px', background: '#F5EEE6', color: '#4A3F35', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>← Dashboard</button>
        </Link>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08' }}>Seller Tools</div>
          <h1 style={{ fontSize: 26, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>Add New Product</h1>
        </div>
      </div>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '80px 60px' }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 28, color: '#1A5C38', marginBottom: 10, fontFamily: "'Playfair Display', serif" }}>Product Listed!</h2>
          <p style={{ fontSize: 15, color: '#8C7B6E' }}>Your product is now listed on Bihar Ka Bazaar. Redirecting to your dashboard...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ padding: '36px 60px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {error && (
              <div style={{ background: '#FDECEA', border: '1px solid rgba(211,47,47,0.2)', borderRadius: 12, padding: '12px 14px', color: '#D32F2F', fontSize: 13, fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Basic Info */}
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8DDD4', fontSize: 15, fontWeight: 700, color: '#1A1410' }}>📦 Basic Information</div>
              <div style={{ padding: 24 }}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>Product Name <span style={{ color: '#C85A08' }}>*</span></label>
                  <input 
                    placeholder="e.g. Premium Makhana 500g" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#C85A08'} 
                    onBlur={e => e.target.style.borderColor = '#E8DDD4'} 
                  />
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>Product Description <span style={{ color: '#C85A08' }}>*</span></label>
                  <textarea 
                    placeholder="Describe your product — what makes it special, how it's made, its quality..." 
                    rows={4}
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#C85A08'} 
                    onBlur={e => e.target.style.borderColor = '#E8DDD4'} 
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>Product Category <span style={{ color: '#C85A08' }}>*</span></label>
                  <select 
                    value={cat}
                    onChange={e => setCat(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#FFFCF8', outline: 'none', color: '#1A1410', cursor: 'pointer', boxSizing: 'border-box' }}
                  >
                    {['Food & Agri', 'Handicrafts', 'Textiles & Silk', 'Spices & Herbs', 'Sweets & Snacks', 'Fresh Fruits'].map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & Stock (Variants) */}
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8DDD4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1410' }}>💰 Pricing & Weight Options</span>
                <button
                  type="button"
                  onClick={addVariant}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    background: '#FFF4EC',
                    color: '#C85A08',
                    border: '1.5px solid #FFE8D4',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  ➕ Add Weight
                </button>
              </div>
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {variants.map((v, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 40px', gap: 12, alignItems: 'end', background: '#FFFCF8', padding: 14, borderRadius: 12, border: '1px solid #E8DDD4' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>Weight Option *</label>
                      <input 
                        placeholder="e.g. 500g, 1kg, 5kg" 
                        value={v.weight}
                        onChange={e => updateVariant(index, 'weight', e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', color: '#1A1410', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = '#C85A08'} 
                        onBlur={e => e.target.style.borderColor = '#E8DDD4'} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>Price (₹) *</label>
                      <input 
                        placeholder="e.g. 480" 
                        value={v.price}
                        onChange={e => updateVariant(index, 'price', e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', color: '#1A1410', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = '#C85A08'} 
                        onBlur={e => e.target.style.borderColor = '#E8DDD4'} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>Stock Qty *</label>
                      <input 
                        placeholder="e.g. 100" 
                        value={v.stock}
                        onChange={e => updateVariant(index, 'stock', e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E8DDD4', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', color: '#1A1410', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = '#C85A08'} 
                        onBlur={e => e.target.style.borderColor = '#E8DDD4'} 
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        disabled={variants.length <= 1}
                        onClick={() => removeVariant(index)}
                        style={{
                          width: '100%',
                          height: 38,
                          borderRadius: 8,
                          border: 'none',
                          background: variants.length <= 1 ? '#F5EEE6' : '#FDECEA',
                          color: variants.length <= 1 ? '#C0B0A0' : '#D32F2F',
                          fontWeight: 700,
                          cursor: variants.length <= 1 ? 'not-allowed' : 'pointer',
                          fontFamily: 'inherit',
                          fontSize: 14
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Image Selector */}
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8DDD4', fontSize: 15, fontWeight: 700, color: '#1A1410' }}>📸 Product Image Assets</div>
              <div style={{ padding: 24 }}>
                {/* Gallery List Preview */}
                {imagesList.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 8 }}>Product Gallery ({imagesList.length}/4 selected)</label>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {imagesList.map((imgUrl, i) => (
                        <div key={i} style={{ width: 64, height: 64, borderRadius: 8, border: '1.5px solid #E8DDD4', overflow: 'hidden', position: 'relative', background: '#F5EEE6' }}>
                          <img src={imgUrl} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={() => removeImageFromList(i)}
                            style={{
                              position: 'absolute',
                              top: 2,
                              right: 2,
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              background: 'rgba(211,47,47,0.85)',
                              color: '#fff',
                              border: 'none',
                              fontSize: 9,
                              fontWeight: 900,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 8 }}>Select reference catalog photo <span style={{ color: '#C85A08' }}>*</span></label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  {PRODUCT_IMAGES.map(img => (
                    <div 
                      key={img.url} 
                      onClick={() => addImageToList(img.url)}
                      style={{
                        border: `2px solid ${imagesList.includes(img.url) ? '#C85A08' : '#E8DDD4'}`,
                        borderRadius: 12,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: '#FFFCF8',
                        position: 'relative'
                      }}
                    >
                      <div style={{ height: 60, width: '100%', background: '#F5EEE6' }}>
                        <img src={img.url} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ fontSize: 10, padding: 6, fontWeight: 700, textAlign: 'center', color: '#1A1410', whiteSpace: 'nowrap', overflow: 'hidden' }}>{img.label}</div>
                    </div>
                  ))}
                </div>
                
                <div style={{ margin: '20px 0 16px', height: 1, background: '#E8DDD4' }} />
                
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 8 }}>Or upload a photo from your computer</label>
                <div 
                  style={{ 
                    border: '2px dashed #E8DDD4', 
                    borderRadius: 12, 
                    padding: '24px 16px', 
                    textAlign: 'center', 
                    background: '#FFFCF8',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#C85A08'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#E8DDD4'}
                  onClick={() => document.getElementById('computer-file-input').click()}
                >
                  <div style={{ fontSize: 24, marginBottom: 6 }}>📁</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1410' }}>Click to Browse local file</div>
                  <div style={{ fontSize: 11, color: '#8C7B6E', marginTop: 4 }}>Supports PNG, JPG, JPEG up to 5MB</div>
                  <input 
                    type="file" 
                    id="computer-file-input" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                    style={{ display: 'none' }} 
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 14 }}>
              <Link href="/dashboard" style={{ flex: 1, textDecoration: 'none' }}>
                <button type="button" style={{ width: '100%', padding: 14, background: '#fff', color: '#4A3F35', border: '1.5px solid #E8DDD4', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Cancel
                </button>
              </Link>
              <button 
                type="submit" 
                disabled={loading}
                style={{ flex: 2, padding: 14, background: loading ? '#8C7B6E' : '#C85A08', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
              >
                {loading ? 'Publishing...' : 'Publish Product →'}
              </button>
            </div>

          </div>

          {/* Live Preview Sticky Card */}
          <div style={{ position: 'sticky', top: 84 }}>
            <div style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #E8DDD4', fontSize: 12, fontWeight: 700, color: '#8C7B6E', textTransform: 'uppercase', letterSpacing: 1 }}>Live Preview</div>
              
              <div style={{ height: 180, width: '100%', background: '#F5EEE6', overflow: 'hidden' }}>
                <img src={selectedImg} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ padding: '16px 18px' }}>
                <div style={{ display: 'inline-block', background: '#EAF5F0', color: '#1A5C38', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 5, marginBottom: 8 }}>NEW LISTING</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1410', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {name || 'Your Product Name'}
                </div>
                <div style={{ fontSize: 12, color: '#8C7B6E', marginBottom: 12 }}>
                  by {seller.fullName} · {seller.district || 'Bihar'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#C85A08' }}>
                    ₹{variants[0]?.price || '0'} <span style={{ fontSize: 11, fontWeight: 400, color: '#C0B0A0' }}>/{variants[0]?.weight || 'unit'}</span>
                  </span>
                  <button type="button" style={{ background: '#C85A08', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'not-allowed', fontFamily: 'inherit' }}>Add to Cart</button>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: 14, background: '#EAF5F0', border: '1px solid rgba(26,92,56,0.2)', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: '#1A5C38' }}>
              ✅ Your product will be live instantly on the marketplace catalog.
            </div>
          </div>

        </form>
      )}

    </div>
  );
}