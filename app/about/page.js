'use client';

import Link from 'next/link';

const STATS = [
  { n: "800+", l: "Registered Sellers" },
  { n: "38", l: "Districts Covered" },
  { n: "7", l: "GI Products" },
  { n: "14K+", l: "Happy Customers" },
];

const TEAM = [
  { name: "Aditya Prakash", role: "President", img: "/images/team/aditya_prakash.jpg", bg: "#E8F5EC" },
  { name: "Aaditya Kumar Sinha", role: "Director", img: "/images/team/aaditya_sinha.jpg", bg: "#EAF5F0" },
  { name: "Hardik Yadav", role: "Co-founder", img: "/images/team/hardik_yadav.jpg", bg: "#FEF8E0" },
  { name: "Rajeev Kumar", role: "Managing Director", img: "/images/team/rajeev_kumar.jpg", bg: "#F0F4FF" },
];

const VALUES = [
  { em: "🌾", title: "Farmer First", desc: "Every decision we make starts with one question — is this good for the farmer or artisan? Their prosperity is our north star." },
  { em: "🔍", title: "Authenticity", desc: "We verify every seller and every product. If it says GI-tagged, it is. No fakes, no compromises, ever." },
  { em: "⚖️", title: "Fair Trade", desc: "We believe the person who grows or makes a product deserves the majority of what a buyer pays for it. Period." },
  { em: "🌍", title: "Bihar's Pride", desc: "Bihar has an extraordinary cultural and agricultural heritage. We exist to share it with the world, on Bihar's own terms." },
];

export default function AboutPage() {
  return (
    <div style={{ background: '#FFFCF8' }}>

      {/* ── HERO ── */}
      <div style={{
        background: 'linear-gradient(135deg, #FAF0E4 0%, #E8F5EC 50%, #FEF8E0 100%)',
        padding: '88px 60px',
        textAlign: 'center',
        borderBottom: '1px solid #E5E1DC',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(#E5E1DC 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.3 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#1B6B3A', marginBottom: 16 }}>About Us</div>
          <h1 style={{ fontSize: 52, color: '#1A1410', marginBottom: 16, fontFamily: "'Playfair Display', serif", lineHeight: 1.1 }}>
            The Story Behind<br />
            <em style={{ color: '#1B6B3A' }}>Bihar Ka Bazaar</em>
          </h1>
          <p style={{ fontSize: 18, color: '#4A3F35', maxWidth: 620, margin: '0 auto 32px', lineHeight: 1.75 }}>
            A Bindisa Agritech initiative to bring Bihar's finest products — and the people who make them — directly to the rest of India.
          </p>
          <Link href="/shop">
            <button style={{ padding: '14px 30px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#1B6B3A', color: '#fff', border: '2px solid #1B6B3A', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#0D3B1E'}
              onMouseLeave={e => e.currentTarget.style.background = '#1B6B3A'}
            >
              Explore Products →
            </button>
          </Link>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ padding: '0 60px', transform: 'translateY(-32px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, maxWidth: 860, margin: '0 auto' }}>
          {STATS.map(s => (
            <div key={s.l} style={{ background: '#fff', border: '1.5px solid #E5E1DC', borderRadius: 16, padding: '24px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#1B6B3A', fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>{s.n}</div>
              <div style={{ fontSize: 13, color: '#7A7067' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MISSION ── */}
      <div style={{ padding: '20px 60px 60px', maxWidth: 920, margin: '0 auto' }}>
        <div style={{ background: '#fff', border: '1.5px solid #E5E1DC', borderRadius: 22, padding: '48px 52px', marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#1B6B3A', marginBottom: 12 }}>Our Mission</div>
          <h2 style={{ fontSize: 32, color: '#1A1410', marginBottom: 20, fontFamily: "'Playfair Display', serif" }}>Why We Built Bihar Ka Bazaar</h2>
          <p style={{ fontSize: 15, color: '#4A3F35', lineHeight: 1.85, marginBottom: 16 }}>
            Bihar Ka Bazaar was born from a single, powerful belief: the farmers, weavers, and artisans of Bihar deserve direct access to India's markets — without intermediaries eroding their earnings.
          </p>
          <p style={{ fontSize: 15, color: '#4A3F35', lineHeight: 1.85, marginBottom: 16 }}>
            Bihar is home to some of India's most unique and celebrated GI-tagged products — from the world-famous Shahi Litchi of Muzaffarpur and fragrant Katarni rice, to the exquisite Madhubani paintings and lustrous Bhagalpuri silk. Yet the people who create these extraordinary products often receive only a fraction of the final sale price.
          </p>
          <p style={{ fontSize: 15, color: '#4A3F35', lineHeight: 1.85 }}>
            We are changing that. Bihar Ka Bazaar is a direct marketplace — connecting producers and buyers without middlemen. Every rupee you pay goes as close to the farmer or artisan as possible.
          </p>
        </div>

        {/* ── BINDISA AGRITECH ── */}
        <div style={{ background: '#fff', border: '1.5px solid #E5E1DC', borderRadius: 22, padding: '48px 52px', marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#1B6B3A', marginBottom: 12 }}>The Company</div>
              <h2 style={{ fontSize: 32, color: '#1A1410', marginBottom: 20, fontFamily: "'Playfair Display', serif" }}>Bindisa Agritech</h2>
              <p style={{ fontSize: 15, color: '#4A3F35', lineHeight: 1.85, marginBottom: 16 }}>
                Bindisa Agritech is a Bihar-based agriculture technology company focused on empowering rural communities through technology, market linkages, and sustainable supply chains.
              </p>
              <p style={{ fontSize: 15, color: '#4A3F35', lineHeight: 1.85 }}>
                Founded with a mission to bridge the rural-urban economic divide, we work directly with farming communities and artisan clusters across all 38 districts of Bihar.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ["🌾", "Working with 800+ farmers & artisans across Bihar"],
                ["📍", "Present in all 38 districts of Bihar"],
                ["🏅", "Supporting GI certification for local products"],
                ["💸", "₹2Cr+ paid directly to sellers so far"],
                ["🚚", "Pan-India delivery to 500+ cities"],
              ].map(([em, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#FFFCF8', border: '1px solid #E5E1DC', borderRadius: 10 }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{em}</span>
                  <span style={{ fontSize: 13, color: '#4A3F35', fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── VALUES ── */}
        <div style={{ background: '#fff', border: '1.5px solid #E5E1DC', borderRadius: 22, padding: '48px 52px', marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#1B6B3A', marginBottom: 12 }}>What We Stand For</div>
          <h2 style={{ fontSize: 32, color: '#1A1410', marginBottom: 36, fontFamily: "'Playfair Display', serif" }}>Our Values</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {VALUES.map(v => (
              <div key={v.title} style={{ padding: '24px', background: '#FFFCF8', border: '1.5px solid #E5E1DC', borderRadius: 16 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{v.em}</div>
                <h3 style={{ fontSize: 18, color: '#1A1410', marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>{v.title}</h3>
                <p style={{ fontSize: 13, color: '#7A7067', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TEAM ── */}
        <div style={{ background: '#fff', border: '1.5px solid #E5E1DC', borderRadius: 22, padding: '48px 52px', marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#1B6B3A', marginBottom: 12 }}>The People</div>
          <h2 style={{ fontSize: 32, color: '#1A1410', marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>Our Team</h2>
          <p style={{ fontSize: 15, color: '#7A7067', marginBottom: 36, lineHeight: 1.6 }}>
            A small, passionate team that deeply believes in Bihar's potential — many of us from Bihar ourselves.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {TEAM.map(t => (
              <div key={t.name} className="interactive-card" style={{ background: '#fff', borderRadius: 16, padding: '28px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 90, height: 90, borderRadius: '50%', overflow: 'hidden', border: '3px solid #EAF5ED', marginBottom: 16, background: '#F8F6F3' }}>
                  <img src={t.img} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1A1410', marginBottom: 4 }}>{t.name}</h4>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#1B6B3A' }}>{t.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONTACT ── */}
        <div style={{ background: '#0D3B1E', border: '1.5px solid #0D3B1E', borderRadius: 22, padding: '48px 52px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>Get In Touch</div>
              <h2 style={{ fontSize: 32, color: '#fff', marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>We'd Love to Hear from You</h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, marginBottom: 28 }}>
                Whether you're a buyer with a question, a farmer who wants to sell, or a brand that wants to partner — we're here.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  ["✉️", "General Enquiries", "contact@biharkazaar.in"],
                  ["🌾", "Seller Support", "sellers@biharkazaar.in"],
                  ["📞", "Phone", "+91 612-XXX-XXXX"],
                  ["📍", "Address", "Patna, Bihar — 800001"],
                ].map(([em, label, value]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 20, width: 36, flexShrink: 0 }}>{em}</span>
                    <div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 28, border: '1px solid rgba(255,255,255,0.2)' }}>
              <h3 style={{ fontSize: 20, color: '#fff', marginBottom: 20, fontFamily: "'Playfair Display', serif" }}>Send us a Message</h3>
              {[["Your Name", "text", "Ram Kumar"], ["Email Address", "email", "ram@example.com"], ["Phone Number", "text", "+91 99999 00000"]].map(([label, type, placeholder]) => (
                <div key={label} style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 5 }}>{label}</label>
                  <input type={type} placeholder={placeholder} style={{ width: '100%', padding: '11px 13px', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: 'rgba(255,255,255,0.1)', outline: 'none', color: '#fff' }} />
                </div>
              ))}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 5 }}>Message</label>
                <textarea placeholder="Write your message here..." rows={4} style={{ width: '100%', padding: '11px 13px', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: 'rgba(255,255,255,0.1)', outline: 'none', color: '#fff', resize: 'vertical', lineHeight: 1.6 }} />
              </div>
              <button style={{ width: '100%', padding: 13, borderRadius: 10, fontSize: 14, fontWeight: 700, background: '#fff', color: '#0D3B1E', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                Send Message →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}