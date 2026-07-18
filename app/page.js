'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Award, Users, ShieldCheck, Truck } from 'lucide-react';

const categories = [
  { label: "Food & Agri", imgSrc: "/images/categories/food_agri.png", count: 84 },
  { label: "Handicrafts", imgSrc: "/images/categories/handicrafts.png", count: 62 },
  { label: "Textiles & Silk", imgSrc: "/images/categories/textiles_silk.png", count: 38 },
  { label: "Spices & Herbs", imgSrc: "/images/categories/spices_herbs.png", count: 29 },
  { label: "Sweets & Snacks", imgSrc: "/images/categories/sweets_snacks.png", count: 47 },
  { label: "Fresh Fruits", imgSrc: "/images/categories/fresh_fruits.png", count: 21 },
];

const marqueeItems = [
  "🪔 Madhubani Paintings",
  "🌿 Shahi Litchi · Muzaffarpur",
  "🍚 Katarni Rice · Bhojpur",
  "🍭 Silao Khaja · Nalanda",
  "🧵 Bhagalpuri Silk",
  "🌾 Makhana · Darbhanga",
  "🥭 Jardalu Mango · Bhagalpur",
];

const testimonials = [
  { name: "Priya Sharma", city: "Mumbai, Maharashtra", em: "👩", bg: "#E8F5EC", text: "The Makhana I ordered was absolutely fresh and of incredible quality. You can taste the difference from what you get in supermarkets." },
  { name: "Vikram Reddy", city: "Bengaluru, Karnataka", em: "👨", bg: "#FFF4EC", text: "Bought a Madhubani painting for my living room. Knowing it came directly from the artist makes it extra special. Stunning work." },
  { name: "Anjali Mehta", city: "New Delhi", em: "👩", bg: "#FEF8E0", text: "The Shahi Litchi was everything I'd heard about. Sweetest, most fragrant lychees I've ever had — delivered to Delhi still perfectly fresh." },
];

const trustItems = [
  ['🚚', 'Free Delivery*', 'On orders above ₹500'],
  ['⚡', 'Fast Shipping', 'Across India in 3–5 days'],
  ['✅', 'Verified Farmers', '100% authentic Bihar products'],
  ['💳', 'Secure Payments', 'UPI, Cards, Net Banking & COD'],
  ['🎧', 'Customer Support', '7 AM – 10 PM, Mon–Sat'],
];

function ProductCard({ p }) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const existing = localStorage.getItem('bkb_cart');
    let cartItems = [];
    try {
      cartItems = existing ? JSON.parse(existing) : [];
    } catch {
      cartItems = [];
    }

    const itemIndex = cartItems.findIndex(item => item.id === p.id);
    if (itemIndex > -1) {
      cartItems[itemIndex].qty += 1;
    } else {
      cartItems.push({
        id: p.id,
        name: p.name,
        seller: p.seller,
        dist: p.dist,
        price: p.price,
        unit: p.unit,
        imgSrc: p.imgSrc || `/images/products/prod_${p.id}.png`,
        bg: p.bg || '#FFF8E8',
        qty: 1
      });
    }
    localStorage.setItem('bkb_cart', JSON.stringify(cartItems));
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link href={`/shop/${p.id}`} className="no-underline">
      <div className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#EEEAE6] bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
        {/* Image */}
        <div className="relative h-[190px] overflow-hidden bg-bg-3">
          {p.gi && (
            <span className="absolute left-2.5 top-2.5 z-1 rounded-md bg-gold px-2.5 py-1 text-[9px] font-extrabold tracking-wide text-white">
              🏅 GI TAG
            </span>
          )}
          <img
            src={p.imgSrc || `/images/products/prod_${p.id}.png`}
            alt={p.name}
            className="h-full w-full object-cover transition-transform duration-400 ease-out group-hover:scale-105"
          />
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
          <div className="mb-1.5 flex justify-between">
            <span className="text-[11px] text-ink-3">📍 {p.dist}</span>
            <span className="text-[11px] font-bold text-gold">★ {p.rat} ({p.rev})</span>
          </div>
          <div className="mb-1 text-[15px] font-bold leading-snug text-ink">{p.name}</div>
          <div className="mb-3.5 text-[11px] text-ink-3">by {p.seller}</div>
          <div className="mt-auto flex items-center justify-between border-t border-bg-3 pt-3.5">
            <div>
              <span className="text-xl font-extrabold text-ink">₹{p.price.toLocaleString()}</span>
              <span className="ml-0.5 text-[11px] text-ink-4">/{p.unit}</span>
            </div>
            <button
              onClick={handleAddToCart}
              className={`cursor-pointer rounded-lg border-none bg-green px-4 py-2 font-sans text-[13px] font-bold text-white transition-all duration-200 hover:bg-green-dark ${added ? 'opacity-85' : ''}`}
            >
              {added ? '✓ Added' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [bestsellers, setBestsellers] = useState([]);
  const [heroSlide, setHeroSlide] = useState(0);

  const fetchBestsellers = useCallback(async () => {
    try {
      const res = await fetch('/api/products?limit=4');
      const data = await res.json();
      if (data.success) {
        setBestsellers(data.products.slice(0, 4));
      }
    } catch (err) {
      console.error('Error loading bestsellers:', err);
    }
  }, []);

  useEffect(() => {
    fetchBestsellers();
  }, [fetchBestsellers]);

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide(s => (s + 1) % 3), 5000);
    return () => clearInterval(timer);
  }, []);

  const heroSlides = [
    {
      title: "FARM FRESH", subtitle: "From Bihar's Fields",
      desc: "Authentic GI-tagged products directly from farmers",
      img: "/images/products/prod_1.png", bg: "linear-gradient(135deg, #FFF9F2 0%, #F0FAF3 100%)",
      accent: '#1B6B3A'
    },
    {
      title: "SHAHI LITCHI", subtitle: "Muzaffarpur's Pride",
      desc: "World-renowned sweetness, now at your doorstep",
      img: "/images/products/prod_4.png", bg: "linear-gradient(135deg, #F0FAF3 0%, #FFF9F2 100%)",
      accent: '#E87B24'
    },
    {
      title: "SILK HERITAGE", subtitle: "Bhagalpur's Legacy",
      desc: "Handwoven Tussar silk from fourth-generation weavers",
      img: "/images/products/prod_3.png", bg: "linear-gradient(135deg, #F0F4FF 0%, #F0FAF3 100%)",
      accent: '#1B6B3A'
    },
  ];

  const currentSlide = heroSlides[heroSlide];

  return (
    <div className="overflow-hidden bg-white font-sans">

      {/* ── HERO BANNER ── */}
      <div
        className="relative grid min-h-[80vh] grid-cols-1 items-center overflow-hidden transition-[background] duration-700 lg:grid-cols-2"
        style={{ background: currentSlide.bg }}
      >
        {/* Decorative circles */}
        <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-green/4" aria-hidden="true" />
        <div className="absolute -bottom-10 -left-10 h-[200px] w-[200px] rounded-full bg-orange/4" aria-hidden="true" />

        {/* Left text content */}
        <div className="relative z-1 px-6 py-12 text-center lg:py-20 lg:pl-[72px] lg:pr-11 lg:text-left">
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-green/20 bg-green-bg px-4 py-1.5 text-[11px] font-bold text-green">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green" />
            Fresh From Bihar&apos;s Farms
          </div>

          <h1
            className="mb-2 font-serif text-4xl leading-[1.05] tracking-tight transition-colors duration-500 md:text-5xl lg:text-[58px]"
            style={{ color: currentSlide.accent }}
          >
            {currentSlide.title}
          </h1>
          <h2 className="mb-4 font-serif text-2xl font-bold leading-tight text-ink md:text-3xl lg:text-4xl">
            {currentSlide.subtitle}
          </h2>

          <p className="mx-auto mb-9 max-w-[420px] text-base leading-relaxed text-ink-2 text-pretty lg:mx-0">
            {currentSlide.desc}. Discover genuine GI-tagged products grown and crafted by real farmers and artisans of Bihar.
          </p>

          <div className="mb-10 flex flex-col justify-center gap-3.5 sm:flex-row lg:justify-start">
            <Link href="/shop">
              <button className="w-full cursor-pointer rounded-[10px] border-none bg-green px-8 py-3.5 font-sans text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(27,107,58,0.25)] transition-all duration-250 hover:-translate-y-0.5 hover:bg-green-dark sm:w-auto">
                ORDER NOW
              </button>
            </Link>
            <Link href="/gi-products">
              <button className="w-full cursor-pointer rounded-[10px] border-2 border-green bg-transparent px-8 py-3.5 font-sans text-[15px] font-bold text-green transition-colors duration-200 hover:bg-green-bg sm:w-auto">
                Explore GI Products
              </button>
            </Link>
          </div>

          {/* Slide dots */}
          <div className="flex justify-center gap-2 lg:justify-start">
            {heroSlides.map((s, i) => (
              <button
                key={i}
                onClick={() => setHeroSlide(i)}
                aria-label={`Show slide ${i + 1}: ${s.title}`}
                className={`h-2.5 cursor-pointer rounded-[5px] border-none transition-all duration-300 ${
                  i === heroSlide ? 'w-7 bg-green' : 'w-2.5 bg-green-bg2'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right — hero product image */}
        <div className="relative z-1 flex items-center justify-center px-6 pb-10 pt-2 lg:py-[60px] lg:pl-0 lg:pr-[72px]">
          <div className="flex h-[280px] w-[280px] items-center justify-center overflow-hidden rounded-full border-[3px] border-green/10 bg-white/70 shadow-[0_20px_60px_rgba(0,0,0,0.08)] md:h-[360px] md:w-[360px] lg:h-[420px] lg:w-[420px]">
            <img
              src={currentSlide.img}
              alt={currentSlide.title}
              className="h-[105%] w-[105%] object-cover transition-all duration-600 ease-out"
            />
          </div>
          {/* Floating badges */}
          <div className="float absolute right-4 top-6 flex items-center gap-2 rounded-[14px] bg-white px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] lg:right-20 lg:top-20">
            <span className="text-[22px]">🏅</span>
            <div>
              <div className="text-xs font-bold text-ink">GI Certified</div>
              <div className="text-[10px] text-ink-3">7 Products</div>
            </div>
          </div>
          <div className="float absolute bottom-6 left-2 flex items-center gap-2 rounded-[14px] bg-white px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] [animation-delay:1.5s] lg:bottom-[100px] lg:left-5">
            <span className="text-[22px]">🌾</span>
            <div>
              <div className="text-xs font-bold text-ink">800+ Farmers</div>
              <div className="text-[10px] text-ink-3">38 Districts</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TRUST STRIP ── */}
      <div className="px-4 py-9 lg:px-[60px]">
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border-2 border-green bg-white sm:grid-cols-2 lg:grid-cols-5">
          {trustItems.map(([icon, title, desc], i) => (
            <div
              key={title}
              className={`flex flex-col items-center px-4 py-[22px] text-center transition-colors duration-250 hover:bg-green-bg ${
                i < trustItems.length - 1 ? 'border-b border-green/15 sm:border-b lg:border-b-0 lg:border-r' : ''
              }`}
            >
              <div className="mb-2.5 flex h-12 w-12 items-center justify-center text-[26px] text-green">{icon}</div>
              <div className="mb-1 text-[13px] font-bold text-green">{title}</div>
              <div className="text-[11px] leading-snug text-ink-3">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MARQUEE ── */}
      <div className="overflow-hidden bg-green py-[13px]">
        <div className="marquee-track flex whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-7 text-[13px] font-medium text-white/92">
              {t}
              <span className="ml-[18px] inline-block h-1 w-1 rounded-full bg-white/35" />
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div className="relative z-1 bg-[radial-gradient(circle_at_10%_20%,#F5FAF6_0%,#FFFFFF_100%)] px-6 py-10 lg:px-[60px] lg:py-16">
        <div className="mb-11 text-center">
          <h2 className="mb-2.5 font-serif text-3xl text-ink lg:text-[34px]">Categories</h2>
          <p className="text-[15px] text-ink-3">Explore authentic products from every corner of Bihar</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map(c => (
            <Link key={c.label} href="/shop" className="no-underline">
              <div className="group cursor-pointer overflow-hidden rounded-2xl border-[1.5px] border-line bg-white transition-all duration-400 hover:-translate-y-2 hover:scale-[1.01] hover:border-green hover:shadow-[0_20px_40px_rgba(27,107,58,0.08)]">
                <div className="flex h-[130px] w-full items-center justify-center overflow-hidden bg-bg-3">
                  <img
                    src={c.imgSrc}
                    alt={c.label}
                    className="h-full w-full object-cover transition-transform duration-400 ease-out group-hover:scale-[1.08]"
                  />
                </div>
                <div className="px-3 py-3.5 text-center">
                  <span className="block text-sm font-bold text-ink">{c.label}</span>
                  <span className="mt-1 block text-[11px] text-ink-3">{c.count} products</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <div className="relative z-1 bg-gradient-to-b from-white to-[#FAF9F6] px-6 py-10 lg:px-[60px] lg:py-16">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="section-eye">Bestsellers</div>
            <h2 className="font-serif text-3xl text-ink lg:text-[32px]">GI-Tagged Favourites</h2>
            <p className="mt-1.5 text-sm text-ink-3">Hand-picked from verified Bihar sellers</p>
          </div>
          <Link href="/shop">
            <button className="inline-flex cursor-pointer items-center gap-1 rounded-[10px] border-[1.5px] border-green bg-green-bg px-5 py-2.5 font-sans text-[13px] font-bold text-green transition-all duration-200 hover:bg-green hover:text-white">
              View all →
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>

      {/* ── GI TAG SECTION ── */}
      <div className="border-y border-line bg-[linear-gradient(135deg,#FAF8F5_0%,#EBF4EE_50%,#FAF8F5_100%)] px-6 py-10 lg:px-[60px] lg:py-16">
        <div className="mx-auto grid max-w-[940px] grid-cols-1 items-center gap-8 md:grid-cols-[200px_1fr] md:gap-13">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <div className="flex h-[110px] w-[110px] items-center justify-center rounded-full border-2 border-[#D4AF37] bg-[linear-gradient(135deg,#FFF9E6_0%,#FFF0CC_100%)] shadow-[0_8px_30px_rgba(212,175,55,0.15)]">
              <Award size={48} className="text-gold" strokeWidth={1.5} />
            </div>
            <div className="text-[10px] font-extrabold uppercase tracking-[2px] text-[#8B6508]">GI Tag Certified</div>
          </div>
          <div className="text-center md:text-left">
            <div className="section-eye">What is a GI Tag?</div>
            <h2 className="mb-3 font-serif text-2xl text-ink lg:text-[26px]">Bihar&apos;s Geographically Indicated Products</h2>
            <p className="mb-4 text-sm leading-relaxed text-ink-2">
              A Geographical Indication tag certifies a product&apos;s special quality and origin from a specific region. Bihar&apos;s GI products are recognized nationally and internationally.
            </p>
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {["Shahi Litchi", "Katarni Rice", "Makhana", "Bhagalpuri Silk", "Madhubani Painting", "Silao Khaja", "Jardalu Mango"].map(t => (
                <span key={t} className="pill-tag inline-flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── WHY BKB ── */}
      <div className="relative z-1 bg-gradient-to-b from-white to-[#FAF8F5] px-6 py-10 lg:px-[60px] lg:py-16">
        <div className="mx-auto mb-10 max-w-[500px] text-center">
          <div className="section-eye">Why Bihar Ka Bazaar</div>
          <h2 className="font-serif text-3xl text-ink lg:text-[32px]">Built for Bihar&apos;s People</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            [Users, "No Middlemen", "#E8F5EC", "#1B6B3A", "Money goes directly to the seller. Farmers and artisans keep 95% of what you pay. No commission cuts, no agents."],
            [ShieldCheck, "Verified & Authentic", "#FFF4EC", "#E88724", "Every seller is verified. GI-tagged products are certified. You always get exactly what Bihar genuinely offers."],
            [Truck, "Pan-India Delivery", "#FEF8E0", "#B8860B", "From Patna to Pune — free shipping on orders above ₹500. Careful packaging for fragile and delicate items."],
          ].map(([Icon, title, bg, color, desc]) => (
            <div
              key={title}
              className="rounded-2xl border-[1.5px] border-line bg-white px-6 py-7 transition-all duration-400 hover:-translate-y-2 hover:border-green hover:shadow-[0_20px_40px_rgba(27,107,58,0.08)]"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[14px]" style={{ background: bg }}>
                <Icon size={24} color={color} strokeWidth={1.8} />
              </div>
              <h3 className="mb-2 font-serif text-lg text-ink">{title}</h3>
              <p className="text-[13px] leading-relaxed text-ink-3">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SELLER BAND ── */}
      <div className="relative grid grid-cols-1 items-center gap-12 overflow-hidden bg-[linear-gradient(135deg,#0D3B1E_0%,#1B6B3A_100%)] px-6 py-12 lg:grid-cols-2 lg:gap-[72px] lg:px-[60px] lg:py-[72px]">
        <div className="absolute right-[120px] top-1/2 -translate-y-1/2 text-[220px] leading-none opacity-6" aria-hidden="true">🌾</div>
        <div className="relative z-1">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-[11px] font-bold text-white/80">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-light" />
            Join 800+ Farmers &amp; Artisans
          </div>
          <h2 className="mb-3.5 font-serif text-3xl leading-tight text-white text-balance lg:text-[38px]">Are You a Farmer or Artisan from Bihar?</h2>
          <p className="mb-6 text-[15px] leading-relaxed text-white/70">
            List your products on Bihar Ka Bazaar and reach customers across all of India. Free to join, no commissions on your first 100 orders.
          </p>
          <div className="mb-7 flex flex-col gap-3.5">
            {[["1", "Register free", "takes 5 minutes"], ["2", "List your products", "photos + description"], ["3", "Get orders", "we handle logistics"], ["4", "Get paid", "direct bank transfer in 3–5 days"]].map(([n, t, s]) => (
              <div key={n} className="flex items-start gap-3">
                <span className="mt-px flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[1.5px] border-white/30 bg-white/15 text-xs font-bold text-white">{n}</span>
                <span className="text-sm text-white/80"><strong className="text-white">{t}</strong> — {s}</span>
              </div>
            ))}
          </div>
          <Link href="/sellers">
            <button className="cursor-pointer rounded-[10px] border-none bg-white px-[30px] py-3.5 font-sans text-sm font-bold text-green shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
              Start Selling Free →
            </button>
          </Link>
        </div>

        {/* Seller Registration CTA Card */}
        <div className="relative z-1 flex flex-col justify-center rounded-[22px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)] lg:p-9">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-green bg-[linear-gradient(135deg,#E8F5EC,#D4EDD9)]">
              <img src="/images/bkb_logo.png" alt="BKB" className="h-[70%] w-[70%] object-contain" />
            </div>
            <h3 className="mb-2 font-serif text-[22px] text-ink">Start Selling on BKB</h3>
            <p className="text-[13px] leading-relaxed text-ink-3">
              Complete our 4-step verified registration. Takes less than 3 minutes.
            </p>
          </div>

          {/* Steps Preview */}
          <div className="mb-6 flex flex-col gap-3">
            {[
              ["Personal Profile", "Name, mobile & photo"],
              ["Business Details", "Address, category & type"],
              ["Product Info", "GST & product details"],
              ["Payout Setup", "Bank account & verification"],
            ].map(([title, desc], i) => (
              <div key={title} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[1.5px] border-green bg-green-bg text-xs font-extrabold text-green">{i + 1}</span>
                <div>
                  <div className="text-[13px] font-bold text-ink">{title}</div>
                  <div className="text-[11px] text-ink-3">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="mb-5 flex flex-wrap justify-center gap-4">
            {["Free Forever", "Verified in 24hrs", "No Commission"].map(t => (
              <div key={t} className="flex items-center gap-1 text-[11px] font-semibold text-green">
                <ShieldCheck size={13} strokeWidth={2} />
                {t}
              </div>
            ))}
          </div>

          <Link href="/sellers">
            <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-[linear-gradient(135deg,#1B6B3A,#2D9F5A)] p-[15px] font-sans text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(27,107,58,0.25)] transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(27,107,58,0.35)]">
              Register as a Seller →
            </button>
          </Link>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="relative z-1 border-y border-line bg-[linear-gradient(135deg,#E8F5EC_0%,#FFFBF7_100%)] px-6 py-8 lg:px-[60px] lg:py-12">
        <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["240+", "Products Listed", "🛍️"],
            ["800+", "Verified Sellers", "🌾"],
            ["38", "Districts Covered", "📍"],
            ["10K+", "Happy Customers", "💚"],
          ].map(([n, l, icon]) => (
            <div key={l} className="px-4 py-5 text-center">
              <div className="mb-2 text-[28px]">{icon}</div>
              <div className="mb-1 font-serif text-[32px] font-extrabold text-green">{n}</div>
              <div className="text-[13px] text-ink-3">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div className="relative z-1 bg-gradient-to-b from-white to-[#FAF9F6] px-6 py-10 lg:px-[60px] lg:py-16">
        <div className="mx-auto mb-10 max-w-[500px] text-center">
          <div className="section-eye">Customer Stories</div>
          <h2 className="font-serif text-3xl text-ink lg:text-[32px]">Loved Across India</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map(t => (
            <div
              key={t.name}
              className="rounded-2xl border-[1.5px] border-line bg-white p-7 transition-all duration-400 hover:-translate-y-2 hover:border-green hover:shadow-[0_20px_40px_rgba(27,107,58,0.08)]"
            >
              <div className="mb-3.5 text-[15px] tracking-[2px] text-green">★★★★★</div>
              <p className="mb-4 text-sm italic leading-relaxed text-ink-2">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full text-xl" style={{ background: t.bg }}>{t.em}</div>
                <div>
                  <div className="text-sm font-bold text-ink">{t.name}</div>
                  <div className="text-xs text-ink-3">{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
