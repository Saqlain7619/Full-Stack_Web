import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate send
    setTimeout(() => {
      toast.success('Message sent! We will contact you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen text-black font-sans selection:bg-red-100 selection:text-red-600">
      
      {/* ── Header ── */}
      <div className="bg-black text-white pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 blur-[80px] rounded-full" />
        
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
           Virtual Concierge
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-display font-bold mb-6 tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
          Get In <span className="text-red-600 italic">Touch</span>
        </h1>
        <p className="max-w-xl mx-auto text-white/40 text-lg font-light leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          Whether you have a question about our virtual try-on technology or need styling advice, our neural concierges are ready to assist.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-3 gap-16">
          
          {/* Info Columns */}
          <div className="space-y-12">
            {[
              { icon: <Mail size={24} className="text-red-600" />, title: 'Neural Mail', val: 'concierge@fashfit.ai', desc: 'Typical response within 2 hours' },
              { icon: <Phone size={24} className="text-red-600" />, title: 'Direct Line', val: '+92 300 1234567', desc: 'Mon - Fri, 9am - 6pm PKT' },
              { icon: <MapPin size={24} className="text-red-600" />, title: 'The Atelier', val: '12-B, Gulberg III, Lahore', desc: 'By appointment only' },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="w-16 h-16 bg-luxury-gray rounded-3xl flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-red-600/20">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-black/30 mb-2">{item.title}</h4>
                  <p className="text-xl font-display font-bold mb-1">{item.val}</p>
                  <p className="text-sm text-black/40 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
            
            {/* Social Links placeholder */}
            <div className="pt-8 border-t border-black/5">
              <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-black/30 mb-6">Social Presence</h4>
              <div className="flex gap-4">
                {['Instagram', 'Twitter', 'LinkedIn'].map(social => (
                  <button key={social} className="px-6 py-3 bg-luxury-gray rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                    {social}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-black/5 p-8 sm:p-12 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-red-600" />
               <div className="mb-10">
                 <h2 className="text-3xl font-display font-bold mb-3 tracking-tight">Transmit Message</h2>
                 <p className="text-black/40 font-medium">Fields marked with an asterisk (*) are mandatory for neural processing.</p>
               </div>
               
               <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="grid sm:grid-cols-2 gap-8">
                   <div className="space-y-3">
                     <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/60 ml-1">Full Name *</label>
                     <input 
                       required 
                       value={form.name} 
                       onChange={e => setForm({...form, name: e.target.value})} 
                       className="w-full bg-luxury-gray border border-transparent px-8 py-5 rounded-[1.5rem] focus:bg-white focus:border-red-600 focus:shadow-xl focus:shadow-red-600/5 outline-none transition-all font-semibold" 
                       placeholder="Enter your name" 
                     />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/60 ml-1">Email Address *</label>
                     <input 
                       required 
                       type="email" 
                       value={form.email} 
                       onChange={e => setForm({...form, email: e.target.value})} 
                       className="w-full bg-luxury-gray border border-transparent px-8 py-5 rounded-[1.5rem] focus:bg-white focus:border-red-600 focus:shadow-xl focus:shadow-red-600/5 outline-none transition-all font-semibold" 
                       placeholder="you@domain.com" 
                     />
                   </div>
                 </div>
                 
                 <div className="space-y-3">
                   <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/60 ml-1">Subject *</label>
                   <input 
                     required 
                     value={form.subject} 
                     onChange={e => setForm({...form, subject: e.target.value})} 
                     className="w-full bg-luxury-gray border border-transparent px-8 py-5 rounded-[1.5rem] focus:bg-white focus:border-red-600 focus:shadow-xl focus:shadow-red-600/5 outline-none transition-all font-semibold" 
                     placeholder="How can we assist you?" 
                   />
                 </div>
                 
                 <div className="space-y-3">
                   <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/60 ml-1">Message Content *</label>
                   <textarea 
                     required 
                     rows={6} 
                     value={form.message} 
                     onChange={e => setForm({...form, message: e.target.value})} 
                     className="w-full bg-luxury-gray border border-transparent px-8 py-6 rounded-[2rem] focus:bg-white focus:border-red-600 focus:shadow-xl focus:shadow-red-600/5 outline-none transition-all font-semibold resize-none" 
                     placeholder="Describe your inquiry in detail..." 
                   />
                 </div>
                 
                 <button 
                   disabled={loading} 
                   type="submit" 
                   className="w-full bg-black text-white py-6 rounded-3xl font-bold uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 hover:bg-red-600 transition-all active:scale-95 shadow-2xl hover:shadow-red-600/40 disabled:opacity-50"
                 >
                   {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                   {loading ? 'Processing Transmission...' : 'Establish Connection'}
                 </button>
               </form>
            </div>
          </div>

        </div>
      </div>
      
      {/* ── Footer Link ── */}
      <div className="py-20 text-center border-t border-black/5 bg-luxury-gray/30">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/20 mb-6">Need immediate help?</p>
        <button className="text-sm font-display font-bold hover:text-red-600 transition-colors border-b-2 border-red-600 pb-1">
          Launch Live Concierge
        </button>
      </div>
    </div>
  );
}