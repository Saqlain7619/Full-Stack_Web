import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Headphones, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate API call — apna backend endpoint yahan lagao
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Message sent! We\'ll reply within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  const contactCards = [
    {
      icon: <Mail size={22} />,
      label: 'Email Us',
      value: 'hello@shopnow.com',
      sub: 'Reply within 24 hours',
      color: '#f97316',
    },
    {
      icon: <Phone size={22} />,
      label: 'Call Us',
      value: '+1 (235) 123-4567',
      sub: 'Mon–Fri, 9am–6pm EST',
      color: '#fb923c',
    },
    {
      icon: <MapPin size={22} />,
      label: 'Visit Us',
      value: '123 Commerce St, NY 10021',
      sub: 'Open Mon–Sat',
      color: '#f97316',
    },
    {
      icon: <Clock size={22} />,
      label: 'Working Hours',
      value: '9:00 AM – 6:00 PM',
      sub: 'Monday to Friday',
      color: '#fb923c',
    },
  ];

  const features = [
    { icon: <MessageSquare size={18} />, title: 'Live Chat', desc: 'Chat with our support team instantly' },
    { icon: <Headphones size={18} />, title: '24/7 Support', desc: 'Always here when you need us' },
    { icon: <ShieldCheck size={18} />, title: 'Secure & Private', desc: 'Your data is always protected' },
  ];

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', color: '#fff', fontFamily: 'inherit' }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #111 50%, #1c0a00 100%)',
        padding: '80px 24px 60px',
        textAlign: 'center',
        borderBottom: '1px solid #2a2a2a',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
          width: '400px', height: '300px',
          background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)',
          padding: '6px 16px', borderRadius: '99px', fontSize: 13, color: '#f97316',
          marginBottom: 20,
        }}>
          <Mail size={13} /> Get In Touch
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, marginBottom: 14, letterSpacing: '-1px' }}>
          We'd love to <span style={{ color: '#f97316' }}>hear from you</span>
        </h1>
        <p style={{ color: '#888', fontSize: 17, maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
          Have a question, feedback, or just want to say hello? Our team is ready to help you.
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>

        {/* ── Contact Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 60 }}>
          {contactCards.map((c) => (
            <div key={c.label} style={{
              background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 16,
              padding: '24px 20px', transition: 'border-color 0.2s, transform 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(249,115,22,0.12)', color: c.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
              }}>{c.icon}</div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.label}</div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{c.value}</div>
              <div style={{ fontSize: 13, color: '#666' }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Main Grid: Form + Info ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 32, alignItems: 'start' }}>

          {/* Contact Form */}
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 20, padding: '36px 32px' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Send us a message</h2>
            <p style={{ color: '#777', fontSize: 14, marginBottom: 28 }}>Fill the form below and we'll get back to you.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Your Name *</label>
                  <input required style={inputStyle} placeholder="John Doe"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    onFocus={e => e.target.style.borderColor = '#f97316'}
                    onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input required type="email" style={inputStyle} placeholder="john@example.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    onFocus={e => e.target.style.borderColor = '#f97316'}
                    onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Subject *</label>
                <input required style={inputStyle} placeholder="How can we help?"
                  value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                  onFocus={e => e.target.style.borderColor = '#f97316'}
                  onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
              </div>

              <div>
                <label style={labelStyle}>Message *</label>
                <textarea required rows={5} style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                  placeholder="Write your message here..."
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  onFocus={e => e.target.style.borderColor = '#f97316'}
                  onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
              </div>

              <button type="submit" disabled={sending} style={{
                background: sending ? '#555' : 'linear-gradient(135deg, #f97316, #ea6000)',
                color: '#fff', border: 'none', borderRadius: 12, padding: '14px 28px',
                fontWeight: 600, fontSize: 15, cursor: sending ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'opacity 0.2s',
              }}>
                {sending
                  ? <><span style={{ width: 16, height: 16, border: '2px solid #fff3', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Sending...</>
                  : <><Send size={16} /> Send Message</>
                }
              </button>
            </form>
          </div>

          {/* Right side info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Why contact us */}
            <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 20, padding: '28px 24px' }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Why contact us?</h3>
              {features.map(f => (
                <div key={f.title} style={{ display: 'flex', gap: 14, marginBottom: 18, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(249,115,22,0.12)', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{f.title}</div>
                    <div style={{ fontSize: 13, color: '#777', lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div style={{
              background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 20,
              overflow: 'hidden', height: 200, position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'repeating-linear-gradient(0deg, #1f1f1f 0px, #1f1f1f 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #1f1f1f 0px, #1f1f1f 1px, transparent 1px, transparent 40px)',
              }} />
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, background: 'rgba(249,115,22,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', border: '2px solid #f97316' }}>
                  <MapPin size={22} color="#f97316" />
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>123 Commerce St</div>
                <div style={{ fontSize: 12, color: '#777' }}>New York, NY 10021</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: 13, fontWeight: 500, color: '#aaa', marginBottom: 7,
};
const inputStyle = {
  width: '100%', padding: '11px 14px',
  background: '#111', border: '1px solid #2a2a2a', borderRadius: 10,
  color: '#fff', fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};