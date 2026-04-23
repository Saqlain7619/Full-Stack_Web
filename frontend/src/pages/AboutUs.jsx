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
  { name: 'Muhammad Zain ul Abideen', role: 'Founding Member', initials: 'MZ', color: '#000' },
  { name: 'Laiba Amjad', role: 'Design Lead', initials: 'LA', color: '#8b0000' },
  { name: 'Laiba Arif', role: 'Creative Director', initials: 'LA', color: '#000' },
  { name: 'Attiba Irshad', role: 'Brand Strategist', initials: 'AI', color: '#8b0000' },
  { name: 'Eman Aftab', role: 'Product Manager', initials: 'EA', color: '#000' },
  { name: 'Maham Masud', role: 'Operations Head', initials: 'MM', color: '#8b0000' },
  { name: 'Bisma', role: 'Customer Experience', initials: 'B', color: '#000' },
];

const timeline = [
  { year: '2022', title: 'The Vision', desc: 'Fash Fit was conceived as a bridge between technology and high fashion.' },
  { year: '2023', title: 'AI Integration', desc: 'Launched our proprietary virtual try-on system to revolutionize selection.' },
  { year: '2024', title: 'Market Leader', desc: 'Became the go-to platform for tech-forward fashion enthusiasts.' },
  { year: '2025', title: 'Global Expansion', desc: 'Bringing the fitting room to every smartphone on the planet.' },
];

export default function AboutUs() {
  return (
    <div className="bg-white min-h-screen text-black font-sans selection:bg-primary-50 selection:text-primary-600">

      {/* ── Hero ── */}
      <div className="relative pt-32 pb-20 px-6 text-center overflow-hidden bg-white border-b border-black/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-5 pointer-events-none bg-[radial-gradient(circle,rgba(139,0,0,0.2)_0%,transparent_70%)]" />
        
        <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 px-4 py-1.5 rounded-full text-xs font-bold text-primary-600 uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <ShoppingBag size={12} /> Our Legacy
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-display font-bold mb-6 tracking-tighter leading-[0.95] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
          Where <span className="text-primary-600 italic">Style</span> Meets<br />Neural Technology
        </h1>
        
        <p className="max-w-2xl mx-auto text-black/60 text-lg sm:text-xl font-light leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          Fash Fit is more than a store. It's a digital atelier dedicated to the perfect fit, 
          leveraging AI to ensure you look your best before you even press buy.
        </p>
        
        <Link to="/catalog" className="btn-primary !bg-black hover:!bg-primary-600 !px-10 !py-5 !rounded-full !text-xs transition-all duration-500 shadow-2xl hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          Explore the Catalog <ArrowRight size={16} className="ml-2 inline" />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {stats.map((s, i) => (
            <div key={s.label} className="group p-8 bg-white border border-black/5 rounded-[2rem] text-center hover:border-primary-600/20 hover:shadow-2xl transition-all duration-700">
              <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform">{s.icon}</div>
              <div className="text-4xl font-display font-bold mb-2 tracking-tighter">{s.value}</div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-black/30">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Team Grid (Requested Upgrade) ── */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4">The Creative Force</h2>
            <p className="text-black/40 font-medium uppercase tracking-[0.2em] text-[11px]">The visionaries behind Fash Fit</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m) => (
              <div key={m.name} className="group bg-white border border-black/5 p-8 rounded-[2rem] text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold border-2 transition-all duration-500 group-hover:scale-110" style={{ borderColor: m.color, color: m.color, backgroundColor: `${m.color}08` }}>
                  {m.initials}
                </div>
                <h3 className="font-bold text-lg mb-1">{m.name}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-black/30">{m.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Core Values ── */}
        <div className="mb-32 grid lg:grid-cols-2 gap-20 items-center">
          <div>
             <h2 className="text-4xl sm:text-5xl font-display font-bold tracking-tighter mb-8 leading-tight">
               Built with <span className="text-primary-600">integrity</span>,<br />designed for precision.
             </h2>
             <p className="text-black/60 text-lg leading-relaxed mb-10 font-light">
               Our commitment goes beyond fashion. We aim to reduce the carbon footprint of returns by providing highly accurate AI try-on tools that guarantee satisfaction.
             </p>
             <div className="grid sm:grid-cols-2 gap-8">
               {values.map(v => (
                 <div key={v.title}>
                   <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center mb-4">{v.icon}</div>
                   <h4 className="font-bold mb-2">{v.title}</h4>
                   <p className="text-sm text-black/40 leading-relaxed">{v.desc}</p>
                 </div>
               ))}
             </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-luxury-gray rounded-[3rem] overflow-hidden">
               <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Fashion" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-primary-600 text-white p-10 rounded-[2rem] shadow-2xl hidden sm:block">
              <p className="text-4xl font-display font-bold">100%</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Precision Guarantee</p>
            </div>
          </div>
        </div>

        {/* ── Journey ── */}
        <div className="bg-black text-white rounded-[4rem] p-12 sm:p-24 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 blur-[120px] rounded-full" />
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-16">The Journey</h2>
            <div className="space-y-12">
              {timeline.map((t, i) => (
                <div key={i} className="flex gap-8 group">
                  <span className="text-primary-600 font-bold font-display text-2xl">{t.year}</span>
                  <div>
                    <h4 className="text-xl font-bold mb-2 group-hover:text-primary-500 transition-colors">{t.title}</h4>
                    <p className="text-white/40 leading-relaxed text-sm">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}