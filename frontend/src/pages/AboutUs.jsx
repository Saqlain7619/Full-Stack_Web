import { ShoppingBag, Users, Star, TrendingUp, Shield, Truck, HeartHandshake, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { icon: <Users size={22} />, value: '50,000+', label: 'Happy Customers' },
  { icon: <ShoppingBag size={22} />, value: '10,000+', label: 'Products Available' },
  { icon: <Star size={22} />, value: '4.9/5', label: 'Average Rating' },
  { icon: <TrendingUp size={22} />, value: '99%', label: 'Satisfaction Rate' },
];

const values = [
  { icon: <Shield size={20} />, title: 'Trust & Security', desc: 'Every transaction is secured with bank-level encryption. Shop with complete peace of mind.' },
  { icon: <Truck size={20} />, title: 'Fast Delivery', desc: 'We partner with top logistics providers to ensure your orders arrive quickly and safely.' },
  { icon: <HeartHandshake size={20} />, title: 'Customer First', desc: 'Our support team is available 24/7 to help you with anything you need, anytime.' },
  { icon: <Award size={20} />, title: 'Quality Guaranteed', desc: 'Every product is vetted for quality. If you\'re not happy, we\'ll make it right.' },
];

const team = [
  { name: 'Alex Morgan', role: 'CEO & Founder', initials: 'AM', color: '#f97316' },
  { name: 'Sarah Chen', role: 'Head of Product', initials: 'SC', color: '#fb923c' },
  { name: 'James Wilson', role: 'Lead Developer', initials: 'JW', color: '#f97316' },
  { name: 'Priya Patel', role: 'Customer Success', initials: 'PP', color: '#fb923c' },
];

const timeline = [
  { year: '2020', title: 'Founded', desc: 'ShopNow launched with a vision to make quality products accessible to everyone.' },
  { year: '2021', title: 'First 10K Users', desc: 'Reached 10,000 customers in just 8 months through word of mouth.' },
  { year: '2022', title: 'Expanded Catalog', desc: 'Grew from 500 to 5,000+ products across 20+ categories.' },
  { year: '2024', title: 'Going Global', desc: 'Now serving customers in 30+ countries with localized experiences.' },
];

export default function AboutUs() {
  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', color: '#fff', fontFamily: 'inherit' }}>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #111 40%, #1c0a00 100%)',
        padding: '90px 24px 70px',
        textAlign: 'center',
        borderBottom: '1px solid #2a2a2a',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '400px',
          background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)',
          padding: '6px 16px', borderRadius: '99px', fontSize: 13, color: '#f97316',
          marginBottom: 24, position: 'relative',
        }}>
          <ShoppingBag size={13} /> Our Story
        </div>
        <h1 style={{ fontSize: 'clamp(34px, 5vw, 58px)', fontWeight: 800, marginBottom: 18, letterSpacing: '-1.5px', position: 'relative' }}>
          We're on a mission to<br /><span style={{ color: '#f97316' }}>redefine shopping</span>
        </h1>
        <p style={{ color: '#888', fontSize: 17, maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.8, position: 'relative' }}>
          ShopNow started with one simple idea — everyone deserves access to great products at fair prices, with an experience that feels personal.
        </p>
        <Link to="/products" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg, #f97316, #ea6000)',
          color: '#fff', padding: '13px 28px', borderRadius: 12,
          fontWeight: 600, fontSize: 15, textDecoration: 'none',
          position: 'relative',
        }}>
          Explore Products <ArrowRight size={16} />
        </Link>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 24px' }}>

        {/* ── Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 80 }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              background: 'linear-gradient(135deg, #1a1a1a, #161616)',
              border: '1px solid #2a2a2a', borderRadius: 16, padding: '28px 20px',
              textAlign: 'center', transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#f97316'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
            >
              <div style={{ width: 48, height: 48, background: 'rgba(249,115,22,0.12)', color: '#f97316', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#f97316', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#777' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Story Section ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', marginBottom: 80 }}>
          <div>
            <div style={{ fontSize: 12, color: '#f97316', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Who We Are</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 18, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Built by shoppers,<br />for shoppers
            </h2>
            <p style={{ color: '#888', lineHeight: 1.8, marginBottom: 16, fontSize: 15 }}>
              We were frustrated with the existing shopping experience — slow sites, unreliable sellers, and hidden fees. So we built ShopNow to be everything we wished existed.
            </p>
            <p style={{ color: '#888', lineHeight: 1.8, fontSize: 15 }}>
              Today, ShopNow serves over 50,000 customers across the globe. Our team of passionate builders works every day to make your shopping experience faster, smarter, and more enjoyable.
            </p>
          </div>

          {/* Visual card */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a, #1c0a00)',
            border: '1px solid #2a2a2a', borderRadius: 20, padding: '36px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'radial-gradient(circle, rgba(249,115,22,0.2), transparent)', borderRadius: '50%' }} />
            {[
              { label: 'Orders Delivered', val: '120,000+' },
              { label: 'Products In Stock', val: '10,000+' },
              { label: 'Countries Served', val: '30+' },
              { label: 'Years in Business', val: '4+' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 0',
                borderBottom: i < 3 ? '1px solid #2a2a2a' : 'none',
              }}>
                <span style={{ color: '#888', fontSize: 14 }}>{item.label}</span>
                <span style={{ color: '#f97316', fontWeight: 700, fontSize: 16 }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Values ── */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 12, color: '#f97316', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>What Drives Us</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.5px' }}>Our Core Values</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
            {values.map((v) => (
              <div key={v.title} style={{
                background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 16,
                padding: '26px 22px', transition: 'border-color 0.2s, transform 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(249,115,22,0.12)', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>{v.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{v.title}</div>
                <div style={{ color: '#777', fontSize: 14, lineHeight: 1.7 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Timeline ── */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 12, color: '#f97316', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>Our Journey</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.5px' }}>How We Got Here</h2>
          </div>
          <div style={{ position: 'relative' }}>
            {/* Line */}
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#2a2a2a', transform: 'translateX(-50%)' }} />
            {timeline.map((t, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end',
                marginBottom: 32, position: 'relative',
              }}>
                {/* Dot */}
                <div style={{
                  position: 'absolute', left: '50%', top: 20, transform: 'translate(-50%, -50%)',
                  width: 14, height: 14, background: '#f97316', borderRadius: '50%',
                  border: '3px solid #0f0f0f', zIndex: 1,
                }} />
                <div style={{
                  width: '44%', background: '#1a1a1a', border: '1px solid #2a2a2a',
                  borderRadius: 14, padding: '20px 22px',
                  marginLeft: i % 2 === 0 ? 0 : 'auto',
                  marginRight: i % 2 === 0 ? 'auto' : 0,
                }}>
                  <div style={{ color: '#f97316', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{t.year}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{t.title}</div>
                  <div style={{ color: '#777', fontSize: 13, lineHeight: 1.6 }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Team ── */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 12, color: '#f97316', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>The People</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.5px' }}>Meet Our Team</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {team.map((m) => (
              <div key={m.name} style={{
                background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 16,
                padding: '28px 20px', textAlign: 'center', transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#f97316'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', margin: '0 auto 14px',
                  background: `rgba(249,115,22,0.15)`, border: `2px solid ${m.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 700, color: m.color,
                }}>{m.initials}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{m.name}</div>
                <div style={{ fontSize: 13, color: '#777' }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA Banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1c0a00, #2a1000)',
          border: '1px solid rgba(249,115,22,0.3)',
          borderRadius: 20, padding: '48px 36px', textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Ready to start shopping?</h2>
          <p style={{ color: '#888', fontSize: 15, marginBottom: 28 }}>Join 50,000+ happy customers and discover amazing products today.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" style={{
              background: 'linear-gradient(135deg, #f97316, #ea6000)',
              color: '#fff', padding: '12px 28px', borderRadius: 12,
              fontWeight: 600, fontSize: 15, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link to="/contact" style={{
              background: 'transparent', color: '#f97316',
              border: '1px solid rgba(249,115,22,0.4)',
              padding: '12px 28px', borderRadius: 12,
              fontWeight: 600, fontSize: 15, textDecoration: 'none',
            }}>
              Contact Us
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}