'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Leaf, MapPin, Award, Users, Truck, Heart, ArrowRight, ShieldCheck, Phone, Mail, CheckCircle } from 'lucide-react';

const STATS = [
  { n: "800+", l: "Registered Sellers", icon: Users, color: '#1B6B3A' },
  { n: "38", l: "Districts Covered", icon: MapPin, color: '#E87B24' },
  { n: "7", l: "GI Products", icon: Award, color: '#B8860B' },
  { n: "14K+", l: "Happy Customers", icon: Heart, color: '#C0392B' },
];

const JOURNEY = [
  { year: "2023", title: "बीज बोया — The Seed Was Planted", desc: "A team of Bihar natives frustrated with middlemen exploitation began mapping farmer communities across rural Bihar. Our first field visits started in Darbhanga and Muzaffarpur.", highlight: true },
  { year: "2024", title: "जमीन पर उतरे — We Hit the Ground", desc: "We personally visited 200+ farming families, sat in their fields, understood their struggles, and built a platform that would let them sell directly. Bindisa Agritech was officially registered." },
  { year: "2025", title: "बाजार खुला — The Marketplace Launched", desc: "Bihar Ka Bazaar went live with 50 verified sellers. Makhana from Darbhanga, Katarni Rice from Bhojpur, Madhubani paintings — real products from real people, shipped pan-India." },
  { year: "2026", title: "800+ किसान जुड़े — Growing Together", desc: "Today we work with 800+ farmers and artisans across all 38 districts of Bihar. Over ₹2 Cr has been paid directly to sellers. No middlemen. No commissions." },
];

const TEAM = [
  { name: "Aditya Prakash", role: "President", img: "/images/team/aditya_prakash.jpg", quote: "किसानों की मेहनत का सही दाम मिलना चाहिए।" },
  { name: "Aaditya Kumar Sinha", role: "Director", img: "/images/team/aaditya_sinha.jpg", quote: "Technology से हम गाँव और शहर को जोड़ सकते हैं।" },
  { name: "Hardik Yadav", role: "Co-founder", img: "/images/team/hardik_yadav.jpg", quote: "बिहार के प्रोडक्ट्स को पूरी दुनिया तक पहुँचाना है।" },
  { name: "Rajeev Kumar", role: "Managing Director", img: "/images/team/rajeev_kumar.jpg", quote: "जब किसान खुश, तो बिहार खुश।" },
];

const VALUES = [
  { icon: Leaf, title: "Farmer First — किसान पहले", desc: "Every decision starts with one question — is this good for the farmer? Their prosperity is our north star. हर फैसले में किसान सबसे पहले।", bg: '#E8F5EC', color: '#1B6B3A' },
  { icon: ShieldCheck, title: "Authenticity — असली गुणवत्ता", desc: "We verify every seller and product. If it says GI-tagged, it is. No fakes, no compromises, ever. हम हर प्रोडक्ट की असलियत जांचते हैं।", bg: '#FFF4EC', color: '#E87B24' },
  { icon: CheckCircle, title: "Fair Trade — उचित मूल्य", desc: "The person who grows or makes a product deserves the majority of what a buyer pays. Period. जो मेहनत करता है, पैसा उसी को मिलना चाहिए।", bg: '#FEF8E0', color: '#B8860B' },
  { icon: Heart, title: "Bihar's Pride — बिहार का गौरव", desc: "Bihar has extraordinary cultural and agricultural heritage. We share it with the world, on Bihar's own terms. बिहार की धरती सोना उगलती है।", bg: '#F0F4FF', color: '#3060CC' },
];

const ACHIEVEMENTS = [
  { metric: "₹2 Cr+", label: "Paid directly to farmers", desc: "बिना बिचौलिये, सीधा किसान को" },
  { metric: "200+", label: "Field visits completed", desc: "खेतों में जाकर किसानों से मिले" },
  { metric: "500+", label: "Cities we ship to", desc: "पूरे भारत में डिलीवरी" },
  { metric: "95%", label: "Revenue goes to sellers", desc: "सबसे कम कमीशन" },
];

export default function AboutPage() {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(null);

  useEffect(() => {
    const cards = document.querySelectorAll('.team-member-card');
    const cleanups = [];
    cards.forEach((card, idx) => {
      const clickHandler = (e) => {
        e.stopPropagation();
        setActiveQuoteIndex(idx);
      };
      const leaveHandler = () => {
        setActiveQuoteIndex(null);
      };
      card.addEventListener('click', clickHandler);
      card.addEventListener('mouseleave', leaveHandler);
      cleanups.push(() => {
        card.removeEventListener('click', clickHandler);
        card.removeEventListener('mouseleave', leaveHandler);
      });
    });
    return () => cleanups.forEach(fn => fn());
  }, []);

  return (
    <div style={{ background: '#FFFCF8', fontFamily: "'Outfit', sans-serif" }}>

      {/* Custom styles for floating quote animation */}
      <style>{`
        @keyframes bkbFloatQuote {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      {/* ══ HERO — Full-width immersive ══ */}
      <div style={{
        background: 'linear-gradient(135deg, #0D3B1E 0%, #1B6B3A 40%, #2D8F5A 100%)',
        padding: '100px 60px 80px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Decorative background elements */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div style={{ position: 'absolute', right: -100, top: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', left: -50, bottom: -80, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,135,36,0.08) 0%, transparent 70%)' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', width: '100%' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 40, padding: '6px 18px', fontSize: 11, fontWeight: 700, color: '#A8E6C3', marginBottom: 28, border: '1px solid rgba(255,255,255,0.15)' }}>
              <Leaf size={12} />
              हमारी कहानी — OUR STORY
            </div>
            <h1 style={{ fontSize: 56, color: '#fff', marginBottom: 20, fontFamily: "'Playfair Display', serif", lineHeight: 1.08, letterSpacing: '-1px' }}>
              खेत से आपके<br />
              <em style={{ color: '#A8E6C3', fontStyle: 'italic' }}>घर तक — सीधा</em>
            </h1>
            <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.85)', maxWidth: 480, lineHeight: 1.7, marginBottom: 16 }}>
              From the golden wheat fields of Bihar to your doorstep — without a single middleman in between.
            </p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', maxWidth: 480, lineHeight: 1.7, marginBottom: 36, fontStyle: 'italic' }}>
              "जब किसान को उसकी मेहनत का सही दाम मिलता है, तो पूरा बिहार आगे बढ़ता है।"
            </p>
            <div style={{ display: 'flex', gap: 14 }}>
              <Link href="/shop">
                <button style={{
                  padding: '14px 30px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                  background: '#fff', color: '#0D3B1E', border: 'none',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; }}
                >
                  Explore Products <ArrowRight size={16} />
                </button>
              </Link>
              <Link href="/sellers">
                <button style={{
                  padding: '14px 30px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                  background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                >
                  Become a Seller
                </button>
              </Link>
            </div>
          </div>

          {/* Hero image collage */}
          <div style={{ position: 'relative', height: 480 }}>
            <div style={{
              position: 'absolute', top: 0, right: 0, width: '75%', height: '70%',
              borderRadius: 20, overflow: 'hidden', border: '4px solid rgba(255,255,255,0.15)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}>
              <img src="/images/about/team_field_1.jpg" alt="BKB team with farmers in the field" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, width: '55%', height: '50%',
              borderRadius: 20, overflow: 'hidden', border: '4px solid rgba(255,255,255,0.15)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              zIndex: 2,
            }}>
              <img src="/images/about/farmer_portrait.jpg" alt="Farmer in the wheat field" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {/* Floating label */}
            <div style={{
              position: 'absolute', bottom: 60, right: 20, background: '#fff',
              borderRadius: 14, padding: '14px 18px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              zIndex: 3, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#E8F5EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Leaf size={18} color="#1B6B3A" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#1B6B3A' }}>जमीन से जुड़े हैं हम</div>
                <div style={{ fontSize: 11, color: '#7A7067' }}>Connected at the grassroots</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ STATS BAR ══ */}
      <div style={{ padding: '0 60px', transform: 'translateY(-40px)', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, maxWidth: 960, margin: '0 auto' }}>
          {STATS.map(s => (
            <div key={s.l} style={{
              background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 18, padding: '28px 24px',
              textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                <s.icon size={20} color={s.color} />
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: s.color, fontFamily: "'Playfair Display', serif" }}>{s.n}</div>
              <div style={{ fontSize: 13, color: '#7A7067' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FIELD VISITS GALLERY — "हम खेतों में जाते हैं" ══ */}
      <div style={{ padding: '40px 60px 72px', background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FAF3 100%)' }}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 44px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#1B6B3A', marginBottom: 10 }}>Field Visits</div>
          <h2 style={{ fontSize: 36, color: '#1A1410', fontFamily: "'Playfair Display', serif", marginBottom: 10 }}>हम खेतों में जाते हैं</h2>
          <p style={{ fontSize: 15, color: '#7A7067', lineHeight: 1.7 }}>
            We don't sit in AC offices — we go to the fields, meet the farmers, understand their challenges, and build solutions together.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ borderRadius: 20, overflow: 'hidden', height: 420, position: 'relative', border: '2px solid #D0EBDA' }}>
            <img src="/images/about/team_field_2.jpg" alt="Team working with farmers in harvest field" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              padding: '40px 28px 24px',
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>खेत में बैठकर बात करते हैं</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>Our team sits with farmers during harvest to understand their real needs</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', flex: 1, position: 'relative', border: '2px solid #D0EBDA' }}>
              <img src="/images/about/farmer_portrait.jpg" alt="Smiling farmer in wheat field" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                padding: '30px 20px 18px',
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>किसान की मुस्कान</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>A farmer's smile — our biggest reward</div>
              </div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #1B6B3A, #2D8F5A)', borderRadius: 20, padding: '28px 24px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: '0 0 auto',
            }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: "'Playfair Display', serif", marginBottom: 8 }}>200+</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#A8E6C3' }}>Field Visits</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>खेतों में जाकर किसानों से मिले</div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ JOURNEY TIMELINE — "सफर अभी शुरू हुआ है" ══ */}
      <div style={{ padding: '72px 60px', background: 'linear-gradient(180deg, #F0FAF3 0%, #FFFCF8 100%)', position: 'relative' }}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 52px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#E87B24', marginBottom: 10 }}>Our Journey</div>
          <h2 style={{ fontSize: 36, color: '#1A1410', fontFamily: "'Playfair Display', serif", marginBottom: 10 }}>सफर अभी शुरू हुआ है</h2>
          <p style={{ fontSize: 15, color: '#7A7067', lineHeight: 1.7 }}>From a bold idea to 800+ farmer partnerships — our journey of building Bihar's direct marketplace.</p>
        </div>

        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: 28, top: 0, bottom: 0, width: 3, background: 'linear-gradient(180deg, #1B6B3A, #D0EBDA)', borderRadius: 2 }} />

          {JOURNEY.map((j, i) => (
            <div key={j.year} style={{ display: 'flex', gap: 28, marginBottom: i < JOURNEY.length - 1 ? 36 : 0, position: 'relative' }}>
              {/* Year dot */}
              <div style={{
                width: 58, height: 58, borderRadius: '50%', flexShrink: 0,
                background: j.highlight ? 'linear-gradient(135deg, #1B6B3A, #2D8F5A)' : '#fff',
                border: j.highlight ? 'none' : '3px solid #D0EBDA',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 800,
                color: j.highlight ? '#fff' : '#1B6B3A',
                boxShadow: j.highlight ? '0 4px 16px rgba(27,107,58,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
                zIndex: 1,
              }}>
                {j.year}
              </div>
              {/* Content */}
              <div style={{
                background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 18,
                padding: '24px 28px', flex: 1,
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                transition: 'all 0.3s',
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A1410', marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>{j.title}</h3>
                <p style={{ fontSize: 14, color: '#4A3F35', lineHeight: 1.75 }}>{j.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ ACHIEVEMENTS — Impact Numbers ══ */}
      <div style={{
        padding: '72px 60px',
        background: 'linear-gradient(135deg, #0D3B1E 0%, #1B6B3A 50%, #0D3B1E 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto 48px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#A8E6C3', marginBottom: 10 }}>Impact</div>
            <h2 style={{ fontSize: 36, color: '#fff', fontFamily: "'Playfair Display', serif", marginBottom: 10 }}>हमारा असर — Our Impact</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>Numbers that reflect our commitment to Bihar's farming community.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, maxWidth: 960, margin: '0 auto' }}>
            {ACHIEVEMENTS.map(a => (
              <div key={a.label} style={{
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 18, padding: '32px 24px', textAlign: 'center',
                backdropFilter: 'blur(12px)',
              }}>
                <div style={{ fontSize: 40, fontWeight: 800, color: '#A8E6C3', fontFamily: "'Playfair Display', serif", marginBottom: 8 }}>{a.metric}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{a.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ VALUES ══ */}
      <div style={{ padding: '72px 60px', background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FAF3 50%, #FEFCF4 100%)' }}>
        <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto 44px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#1B6B3A', marginBottom: 10 }}>What We Stand For</div>
          <h2 style={{ fontSize: 36, color: '#1A1410', fontFamily: "'Playfair Display', serif", marginBottom: 10 }}>हमारे मूल्य — Our Values</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, maxWidth: 1000, margin: '0 auto' }}>
          {VALUES.map(v => (
            <div key={v.title} className="interactive-card" style={{ background: '#fff', borderRadius: 18, padding: '28px 22px' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: v.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <v.icon size={22} color={v.color} />
              </div>
              <h3 style={{ fontSize: 16, color: '#1A1410', marginBottom: 10, fontFamily: "'Playfair Display', serif", lineHeight: 1.3 }}>{v.title}</h3>
              <p style={{ fontSize: 13, color: '#7A7067', lineHeight: 1.75 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ TEAM ══ */}
      <div style={{ padding: '72px 60px', background: 'linear-gradient(180deg, #FEFCF4 0%, #FFFCF8 100%)' }}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 44px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#E87B24', marginBottom: 10 }}>The People</div>
          <h2 style={{ fontSize: 36, color: '#1A1410', fontFamily: "'Playfair Display', serif", marginBottom: 10 }}>हमारी टीम — Our Team</h2>
          <p style={{ fontSize: 15, color: '#7A7067', lineHeight: 1.7 }}>
            A small, passionate team that deeply believes in Bihar's potential — most of us from Bihar ourselves, connected to this land and its people.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22, maxWidth: 1000, margin: '0 auto' }}>
          {TEAM.map((t, index) => {
            const isActive = activeQuoteIndex === index;
            return (
              <div
                key={t.name}
                id={`team-card-${index}`}
                className="interactive-card team-member-card"
                onClick={() => {
                  console.log("Team member clicked: ", t.name, index);
                  setActiveQuoteIndex(index);
                }}
                onMouseLeave={() => {
                  console.log("Mouse left team member: ", t.name, index);
                  setActiveQuoteIndex(null);
                }}
                style={{
                  background: '#fff',
                  borderRadius: 18,
                  padding: '36px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'visible', // Ensure the speech bubble is not clipped
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive ? '0 15px 35px rgba(27,107,58,0.12)' : 'none',
                }}
              >
                {/* Floating quote bubble above the card */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    bottom: '108%', // Positioned above the card
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '94%',
                    minWidth: '240px',
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(12px)',
                    border: '2px solid #1B6B3A', // BKB Green border
                    borderRadius: '16px',
                    padding: '16px 18px',
                    boxShadow: '0 12px 28px rgba(27, 107, 58, 0.16)',
                    zIndex: 100,
                    animation: 'bkbFloatQuote 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    pointerEvents: 'none',
                  }}>
                    <p style={{
                      fontSize: '13px',
                      color: '#1A1410',
                      fontStyle: 'italic',
                      lineHeight: '1.6',
                      margin: 0,
                      fontWeight: '600',
                      textAlign: 'center',
                    }}>
                      "{t.quote}"
                    </p>
                    {/* Speech bubble arrow pointing down */}
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderTop: '8px solid #1B6B3A',
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%) translateY(-2px)',
                      width: 0,
                      height: 0,
                      borderLeft: '7px solid transparent',
                      borderRight: '7px solid transparent',
                      borderTop: '7px solid rgba(255, 255, 255, 0.98)',
                    }} />
                  </div>
                )}

                <div style={{
                  width: 160,
                  height: 160,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '4px solid #E8F5EC',
                  marginBottom: 20,
                  background: '#F8F6F3',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isActive ? 'scale(1.06)' : 'none',
                }}>
                  <img src={t.img} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                <h4 style={{
                  fontSize: 19,
                  fontWeight: 700,
                  color: '#1A1410',
                  marginBottom: 6,
                  transition: 'color 0.3s ease',
                }}>
                  {t.name}
                </h4>
                
                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#1B6B3A',
                }}>
                  {t.role}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ COMPANY INFO — Bindisa Agritech ══ */}
      <div style={{ padding: '72px 60px', background: 'linear-gradient(180deg, #FFFCF8 0%, #F0FAF3 100%)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ background: '#fff', border: '1.5px solid #D0EBDA', borderRadius: 22, padding: '52px 56px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 52, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#1B6B3A', marginBottom: 12 }}>The Company</div>
                <h2 style={{ fontSize: 34, color: '#1A1410', marginBottom: 20, fontFamily: "'Playfair Display', serif" }}>Bindisa Agritech</h2>
                <p style={{ fontSize: 15, color: '#4A3F35', lineHeight: 1.85, marginBottom: 16 }}>
                  Bindisa Agritech is a Bihar-based agriculture technology company focused on empowering rural communities through technology, market linkages, and sustainable supply chains.
                </p>
                <p style={{ fontSize: 15, color: '#4A3F35', lineHeight: 1.85 }}>
                  Founded with a mission to bridge the rural-urban economic divide, we work directly with farming communities and artisan clusters across all 38 districts of Bihar. <em style={{ color: '#1B6B3A' }}>गाँव और शहर के बीच की दूरी मिटाना — यही हमारा मकसद है।</em>
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  [Leaf, "Working with 800+ farmers & artisans across Bihar"],
                  [MapPin, "Present in all 38 districts of Bihar"],
                  [Award, "Supporting GI certification for local products"],
                  [Heart, "₹2Cr+ paid directly to sellers so far"],
                  [Truck, "Pan-India delivery to 500+ cities"],
                ].map(([Icon, text]) => (
                  <div key={text} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                    background: '#F0FAF3', border: '1px solid #D0EBDA', borderRadius: 12,
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#E8F5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} color="#1B6B3A" />
                    </div>
                    <span style={{ fontSize: 13, color: '#1A1410', fontWeight: 500 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ CTA — Join us ══ */}
      <div style={{
        padding: '72px 60px', textAlign: 'center',
        background: 'linear-gradient(135deg, #FFF5EC 0%, #F0FAF3 50%, #FEF8E0 100%)',
        borderTop: '1px solid #E8DDD4',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 34, color: '#1A1410', fontFamily: "'Playfair Display', serif", marginBottom: 12 }}>
            आइए, साथ मिलकर<br /><em style={{ color: '#1B6B3A' }}>बिहार को आगे बढ़ाएं</em>
          </h2>
          <p style={{ fontSize: 16, color: '#4A3F35', lineHeight: 1.75, marginBottom: 32 }}>
            Whether you're a buyer supporting Bihar's farmers, a seller ready to reach pan-India customers, or someone who just believes in fair trade — come join us.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <Link href="/shop">
              <button style={{
                padding: '15px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                background: '#1B6B3A', color: '#fff', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.25s',
                boxShadow: '0 4px 16px rgba(27,107,58,0.25)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#0D3B1E'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1B6B3A'; e.currentTarget.style.transform = 'none'; }}
              >
                Shop Now <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/sellers">
              <button style={{
                padding: '15px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                background: '#fff', color: '#1B6B3A', border: '2px solid #1B6B3A',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#E8F5EC'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
              >
                Register as Seller
              </button>
            </Link>
            <Link href="/contact">
              <button style={{
                padding: '15px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                background: '#fff', color: '#E87B24', border: '2px solid #E87B24',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FFF4EC'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
              >
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}