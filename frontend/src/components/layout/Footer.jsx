import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-500 pt-16 sm:pt-24 pb-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 mb-16 sm:mb-20 relative z-10">

          <div className="space-y-8 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="bg-white p-4 rounded-[2rem] inline-block w-fit group shadow-2xl ring-1 ring-black/5 hover:scale-105 transition-all duration-500">
              <Link to="/" className="flex items-center gap-3">
                <img 
                  src="/logo-icon.png" 
                  alt="Fash Fit Icon" 
                  className="h-12 sm:h-16 w-auto object-contain" 
                />
              </Link>
            </div>
            <p className="text-sm leading-relaxed text-white/40 font-light max-w-sm">
              Crafting a new paradigm in digital fashion. FASH FIT combines neural try-on technology with high-end craftsmanship to redefine your wardrobe.
            </p>
            <div className="flex gap-5">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:bg-primary-600 hover:text-white hover:border-primary-600 hover:-translate-y-1 transition-all duration-300">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h3 className="text-white text-[10px] font-bold uppercase tracking-[0.4em] mb-10 text-primary-600">The Catalog</h3>
            <ul className="space-y-5 text-[12px] font-bold uppercase tracking-widest text-white/40">
              {['New Arrivals', 'Featured', 'Limited Edition', 'Atelier Pieces', 'Accessories'].map(item => (
                <li key={item}><Link to="/catalog" className="hover:text-white transition-colors duration-300">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h3 className="text-white text-[10px] font-bold uppercase tracking-[0.4em] mb-10 text-primary-600">Concierge</h3>
            <ul className="space-y-5 text-[12px] font-bold uppercase tracking-widest text-white/40">
              {[['Member Profile', '/profile'], ['Order Tracking', '/orders'], ['Shopping Bag', '/cart'], ['Our Story', '/about'], ['Get In Touch', '/contact']].map(([label, path]) => (
                <li key={label}><Link to={path} className="hover:text-white transition-colors duration-300">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h3 className="text-white text-[10px] font-bold uppercase tracking-[0.4em] mb-10 text-primary-600">Atelier</h3>
            <ul className="space-y-8 text-[13px] text-white/40">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0"><MapPin size={16} className="text-primary-600" /></div>
                <span className="leading-relaxed pt-1">12-B, Gulberg III,<br />Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0"><Phone size={16} className="text-primary-600" /></div>
                <span className="pt-1">+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0"><Mail size={16} className="text-primary-600" /></div>
                <span className="lowercase pt-1">atelier@fashfit.styling</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500">
            © {new Date().getFullYear()} <span className="text-white">FASH FIT</span> <span className="text-primary-600">STYLING</span>. All rights reserved.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.3em] font-bold">
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map(item => (
              <a key={item} href="#" className="text-gray-500 hover:text-white transition-colors duration-300">{item}</a>
            ))}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/5 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 blur-[80px] rounded-full -ml-32 -mb-32" />
      </div>
    </footer>
  );
}
