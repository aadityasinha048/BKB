'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Leaf, Sprout, FlaskConical, Handshake, Award, ArrowRight, Microscope, Landmark, Smartphone } from 'lucide-react';

const MILESTONES = [
  {
    id: 'farmers',
    badge: 'Our Roots',
    badgeColor: '#1A5C38',
    badgeBg: '#EAF5F0',
    year: '2023',
    title: 'खेत से शुरुआत - It Began in the Fields',
    subtitle: 'Grassroots Farmer Outreach | Bihar',
    body: "Before writing a single line of code, we drove into the villages. We sat with farmers under trees, ate at their homes, and truly listened. The story of Bihar Ka Bazaar did not start in a boardroom - it started in the paddy fields of Darbhanga, the makhana lakes of Mithilanchal, and the silk looms of Bhagalpur.",
    detail: "We personally visited 200+ farming families across 15 districts, understanding that the core problem was not production - it was access. Farmers were getting Rs 15 for Makhana that sells at Rs 300 in Delhi. That gap became our mission.",
    image: '/images/mission/farmer_field_visit.jpg',
    imageCaption: 'Team BKB meeting farmers at their fields in rural Bihar',
    imagePosition: 'right',
    accent: '#1A5C38',
    icon: Sprout,
    stat: { n: '200+', l: 'Field Visits' },
  },
  {
    id: 'icar',
    badge: 'Science + Farming',
    badgeColor: '#C85A08',
    badgeBg: '#FFF4EC',
    year: '2023',
    title: 'ICAR Lab Visit - Science Meets Agriculture',
    subtitle: 'Indian Council of Agricultural Research',
    body: "To truly serve farmers, we needed to understand agriculture at its scientific core. Our team visited ICAR labs to understand soil science, crop quality certification, GI-tagging processes, and post-harvest management - knowledge that now powers our product verification system.",
    detail: "The visit opened our eyes to how world-class agricultural research often does not reach the farmers who need it most. Bihar Ka Bazaar committed to bridging that gap - connecting ICAR-certified quality standards with our seller onboarding process.",
    image: '/images/mission/icar_lab_visit.jpg',
    imageCaption: 'BKB team at ICAR research laboratory studying crop quality and certification processes',
    imagePosition: 'left',
    accent: '#C85A08',
    icon: FlaskConical,
    stat: { n: 'ICAR', l: 'Certified Standards' },
  },
  {
    id: 'bihar-minister',
    badge: 'Government Support',
    badgeColor: '#7B3FA0',
    badgeBg: '#F5EEFF',
    year: '2024',
    title: 'Bihar Agriculture Minister - Seeking Blessings',
    subtitle: "Meeting with Bihar's Agricultural Leadership",
    body: "We presented Bihar Ka Bazaar's platform and mission to the Agriculture Minister, Bihar Government. The meeting was a milestone - endorsement from the state's top agricultural leadership validated our approach and opened doors to collaborate with government schemes like ATMA and PM-KISAN.",
    detail: "The minister expressed strong support for BKB's zero-commission model and our commitment to ensuring maximum revenue reaches the farmer directly. We demonstrated our platform and discussed integration with Bihar's rural Self-Help Groups (SHGs).",
    image: '/images/mission/bihar_agri_minister.jpg',
    imageCaption: 'Team BKB presenting Bihar Ka Bazaar platform to the Agriculture Minister of Bihar',
    imagePosition: 'right',
    imageObjectPosition: 'left center',
    accent: '#7B3FA0',
    icon: Handshake,
    stat: { n: 'State', l: 'Government Backed' },
  },
  {
    id: 'msme-minister',
    badge: 'MSME & Entrepreneurship',
    badgeColor: '#1A5C38',
    badgeBg: '#EAF5F0',
    year: '2024',
    title: 'Union MSME Minister Shri Jitan Ram Manjhi - Empowering Bihar Artisans',
    subtitle: 'Shri Jitan Ram Manjhi, Union Minister of Micro, Small & Medium Enterprises, India',
    body: "We had the honour of presenting Bihar Ka Bazaar to Shri Jitan Ram Manjhi, Union Minister of MSME, Government of India. Bihar's artisans (weavers, potters, painters, and food producers) are micro-entrepreneurs at heart. BKB gives them a direct digital channel to sell pan-India without middlemen.",
    detail: "The Minister appreciated how BKB is creating a marketplace specifically designed for Bihar's micro-entrepreneurs and artisan communities. The meeting opened pathways to explore alignment with government MSME schemes including PM Vishwakarma and MUDRA - giving BKB sellers access to credit, skilling, and market support.",
    image: '/images/mission/bihar_minister_demo.jpg',
    imageCaption: 'Team BKB presenting Bihar Ka Bazaar platform to Shri Jitan Ram Manjhi, Union Minister of MSME',
    imagePosition: 'left',
    imageObjectPosition: 'center center',
    accent: '#1A5C38',
    icon: Handshake,
    stat: { n: 'MSME', l: 'Ministry Support' },
  },
  {
    id: 'central-minister',
    badge: 'National Vision',
    badgeColor: '#B8860B',
    badgeBg: '#FEF8E0',
    year: '2024',
    title: 'Union Agriculture Minister - A National Mission',
    subtitle: 'Shri Shivraj Singh Chouhan, Union Minister of Agriculture and Farmers Welfare',
    body: "The culmination of our outreach was a meeting with the Union Minister of Agriculture and Farmers Welfare, Shri Shivraj Singh Chouhan. We presented our zero-commission direct farmer trade model and Bihar GI-tagged products potential for global markets.",
    detail: "The Minister appreciated BKB's farmer-first philosophy and our grassroots approach of personally visiting farming communities before building technology solutions. This meeting reinforced our belief: technology in the service of agriculture is not just a business - it is a national mission.",
    image: '/images/mission/central_agri_minister.jpg',
    imageCaption: 'Team BKB presenting Bihar Ka Bazaar to Shri Shivraj Singh Chouhan, Union Minister of Agriculture',
    imagePosition: 'right',
    accent: '#B8860B',
    icon: Award,
    stat: { n: 'National', l: 'Recognition' },
  },
];

const IMPACT = [
  { n: '800+', l: 'Registered Sellers', desc: 'Farmers and artisans from all 38 Bihar districts', color: '#1A5C38', bg: '#EAF5F0' },
  { n: 'Rs 2 Cr+', l: 'Paid to Farmers', desc: 'Directly to sellers - no middlemen', color: '#C85A08', bg: '#FFF4EC' },
  { n: '200+', l: 'Field Visits', desc: 'We went to fields before building tech', color: '#7B3FA0', bg: '#F5EEFF' },
  { n: '14K+', l: 'Happy Customers', desc: 'Across India buying directly from Bihar', color: '#B8860B', bg: '#FEF8E0' },
];

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(30px)', transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

function Card({ m, i }) {
  const imgLeft = m.imagePosition === 'left';
  const Icon = m.icon;
  return (
    <FadeIn delay={i * 60}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: 28, overflow: 'hidden', border: '1.5px solid #E8DDD4', boxShadow: '0 4px 40px rgba(0,0,0,0.07)', marginBottom: 44, background: '#fff' }}>
        <div style={{ order: imgLeft ? 0 : 1, position: 'relative', minHeight: 440, overflow: 'hidden' }}>
          <img src={m.image} alt={m.imageCaption} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: m.imageObjectPosition || 'center top', display: 'block', transition: 'transform 0.5s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)', pointerEvents: 'none' }} />
          <p style={{ position: 'absolute', bottom: 16, left: 16, right: 16, color: 'rgba(255,255,255,0.88)', fontSize: 12, fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{m.imageCaption}</p>
          <div style={{ position: 'absolute', top: 18, left: 18, background: m.accent, color: '#fff', fontSize: 12, fontWeight: 800, padding: '5px 14px', borderRadius: 100 }}>{m.year}</div>
        </div>
        <div style={{ order: imgLeft ? 1 : 0, padding: '48px 46px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start', background: m.badgeBg, color: m.badgeColor, fontSize: 10, fontWeight: 800, padding: '5px 13px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 18 }}>
            <Icon size={11} /> {m.badge}
          </span>
          <h2 style={{ fontSize: 25, fontWeight: 800, color: '#1A1410', fontFamily: 'Georgia, serif', lineHeight: 1.3, marginBottom: 6 }}>{m.title}</h2>
          <p style={{ fontSize: 12, fontWeight: 700, color: m.accent, marginBottom: 18, letterSpacing: 0.3 }}>{m.subtitle}</p>
          <p style={{ fontSize: 14.5, color: '#4A3F35', lineHeight: 1.82, marginBottom: 14 }}>{m.body}</p>
          <p style={{ fontSize: 13.5, color: '#6B5C50', lineHeight: 1.75, paddingLeft: 14, borderLeft: `3px solid ${m.accent}`, fontStyle: 'italic' }}>{m.detail}</p>
          <div style={{ marginTop: 28, alignSelf: 'flex-start', background: m.badgeBg, border: `1.5px solid ${m.accent}30`, borderRadius: 14, padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: m.accent }}>{m.stat.n}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: m.badgeColor }}>{m.stat.l}</div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

export default function MissionPage() {
  return (
    <div style={{ background: '#FFFCF8', minHeight: '100vh', fontFamily: 'Inter, Segoe UI, sans-serif' }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #0B3320 0%, #1A5C38 55%, #0F2E1A 100%)', padding: '104px 64px 92px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 18% 60%, rgba(200,90,8,0.18) 0%, transparent 55%), radial-gradient(circle at 82% 28%, rgba(184,134,11,0.15) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 820, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 100, padding: '7px 20px', marginBottom: 30 }}>
            <Leaf size={14} color="#86EFAC" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#86EFAC', letterSpacing: 2.5, textTransform: 'uppercase' }}>Our Mission</span>
          </div>
          <h1 style={{ fontSize: 62, fontWeight: 900, color: '#fff', fontFamily: 'Georgia, serif', lineHeight: 1.12, marginBottom: 26 }}>
            From the Fields of Bihar<br /><span style={{ color: '#FBD97A' }}>to Every Indian Home</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, maxWidth: 660, margin: '0 auto 42px' }}>
            Bihar Ka Bazaar exists for one reason - to make sure the farmer who grows your food gets paid fairly for it. No middlemen. No exploitation. Just direct trade, respect, and dignity for Bihar's farmers and artisans.
          </p>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 18, padding: '20px 36px', maxWidth: 560 }}>
            <p style={{ fontSize: 16.5, color: '#FBD97A', fontStyle: 'italic', lineHeight: 1.65, fontWeight: 500 }}>
              "किसान की मेहनत का सही दाम मिलना चाहिए - यही बिहार का बाज़ार की नींव है।"
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 10, fontWeight: 600 }}>- Bihar Ka Bazaar Founding Principle</p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: '#fff', borderBottom: '1px solid #E8DDD4', padding: '60px 64px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 10 }}>Impact So Far</div>
              <h2 style={{ fontSize: 34, fontWeight: 900, color: '#1A1410', fontFamily: 'Georgia, serif' }}>Numbers That Tell Our Story</h2>
            </div>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {IMPACT.map((s, i) => (
              <FadeIn key={s.n} delay={i * 80}>
                <div style={{ background: s.bg, borderRadius: 22, padding: '30px 24px', textAlign: 'center', border: `1.5px solid ${s.color}20`, transition: 'transform 0.22s, box-shadow 0.22s', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 14px 36px ${s.color}22`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                  <div style={{ fontSize: 40, fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 8 }}>{s.n}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#1A1410', marginBottom: 6 }}>{s.l}</div>
                  <div style={{ fontSize: 12, color: '#6B5C50', lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION BLOCK + CARDS */}
      <section style={{ padding: '80px 64px 60px', maxWidth: 1120, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ background: 'linear-gradient(135deg,#1A5C38 0%,#0B3320 100%)', borderRadius: 30, padding: '64px 68px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', marginBottom: 80 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#86EFAC', marginBottom: 16 }}>Our Mission</div>
              <h2 style={{ fontSize: 38, fontWeight: 900, color: '#fff', fontFamily: 'Georgia, serif', lineHeight: 1.2, marginBottom: 22 }}>Help Farmers Grow -<br /><span style={{ color: '#FBD97A' }}>In Every Sense</span></h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.78)', lineHeight: 1.85, marginBottom: 18 }}>Our mission is to eliminate the exploitative middlemen chain that has kept Bihar's farmers poor for generations. By connecting them directly to buyers across India, we ensure farmers earn 3 to 5 times more than what middlemen would pay them.</p>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.78)', lineHeight: 1.85 }}>But helping farmers grow is not just about money. It's about dignity, recognition, and building a future where Bihar's youth sees farming as a path to prosperity - not a trap of poverty.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { Icon: Sprout, t: 'Eliminate Middlemen', d: '95% of every rupee you pay goes directly to the farmer or artisan.' },
                { Icon: Microscope, t: 'Science-Backed Quality', d: 'ICAR research partnerships ensure quality and authenticity of every product.' },
                { Icon: Landmark, t: 'Government Aligned', d: 'Working with both Bihar state and central government agriculture initiatives.' },
                { Icon: Smartphone, t: 'Technology for All', d: 'Building tech simple enough for first-generation smartphone users in rural Bihar.' },
              ].map(p => (
                <div key={p.t} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14, border: '1px solid rgba(255,255,255,0.12)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <p.Icon size={20} color="#FBD97A" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{p.t}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.62)', lineHeight: 1.55 }}>{p.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 12 }}>The Journey</div>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: '#1A1410', fontFamily: 'Georgia, serif', lineHeight: 1.2, marginBottom: 16 }}>How We Are Making It Happen</h2>
            <p style={{ fontSize: 16, color: '#6B5C50', lineHeight: 1.75, maxWidth: 620, margin: '0 auto' }}>From meeting farmers in their fields to presenting to the nation's top agricultural leadership - every step taken with one goal: a better deal for Bihar's farmers.</p>
          </div>
        </FadeIn>

        {MILESTONES.map((m, i) => <Card key={m.id} m={m} i={i} />)}

        <FadeIn>
          <div style={{ background: '#fff', border: '2px solid #E8DDD4', borderRadius: 30, padding: '64px', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(26,92,56,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><Sprout size={36} color="#1A5C38" /></div>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#1A1410', fontFamily: 'Georgia, serif', marginBottom: 18 }}>Be Part of Bihar's <span style={{ color: '#1A5C38' }}>Agricultural Revolution</span></h2>
            <p style={{ fontSize: 16, color: '#6B5C50', lineHeight: 1.8, maxWidth: 560, margin: '0 auto 40px' }}>When you buy from Bihar Ka Bazaar, you're not just getting a product - you're directly changing a farmer's life.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#C85A08', color: '#fff', padding: '15px 34px', borderRadius: 50, fontSize: 14, fontWeight: 800, textDecoration: 'none', boxShadow: '0 4px 22px rgba(200,90,8,0.35)', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#A04806'}
                onMouseLeave={e => e.currentTarget.style.background = '#C85A08'}>
                Shop from Farmers <ArrowRight size={16} />
              </Link>
              <Link href="/sellers" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#1A5C38', padding: '15px 34px', borderRadius: 50, fontSize: 14, fontWeight: 800, textDecoration: 'none', border: '2px solid #1A5C38', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1A5C38'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1A5C38'; }}>
                Sell Your Products <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
