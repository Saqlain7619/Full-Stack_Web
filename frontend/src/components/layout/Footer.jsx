import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-500 pt-24 pb-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 relative z-10">

          <div className="space-y-6">
            <div className="bg-white p-3.5 rounded-2xl inline-block w-fit group shadow-premium ring-1 ring-black/5">
              <Link to="/" className="flex items-center gap-3">
                <img 
                  src="/logo-icon.png" 
                  alt="Fash Fit Icon" 
                  className="h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-110" 
                />
              </Link>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 font-light">
              Redefining heritage and modern elegance. Our collection represents the pinnacle of premium craftsmanship for the discerning individual.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white text-[11px] font-bold uppercase tracking-[0.2em] mb-8">Collections</h3>
            <ul className="space-y-4 text-[13px] font-medium">
              {['New Arrivals', 'Featured', 'Limited Edition', 'Bestsellers', 'Accessories'].map(item => (
                <li key={item}><Link to="/products" className="hover:text-primary-600 transition-colors tracking-wide">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-[11px] font-bold uppercase tracking-[0.2em] mb-8">Client Service</h3>
            <ul className="space-y-4 text-[13px] font-medium">
              {[['Profile', '/profile'], ['Orders', '/orders'], ['Shopping Bag', '/cart'], ['Stores', '/about'], ['Contact', '/contact']].map(([label, path]) => (
                <li key={label}><Link to={path} className="hover:text-primary-600 transition-colors tracking-wide">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-[11px] font-bold uppercase tracking-[0.2em] mb-8">Contact</h3>
            <ul className="space-y-6 text-[13px]">
              <li className="flex items-start gap-4">
                <MapPin size={18} className="text-primary-600 shrink-0" />
                <span className="leading-relaxed">123 Avenue des Champs-Élysées, Paris, FR</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={18} className="text-primary-600 shrink-0" />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={18} className="text-primary-600 shrink-0" />
                <span className="lowercase">contact@fashfit.styling</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold">© 2024 FASH FIT Scaling. All rights reserved.</p>
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] font-bold">
            {['Privacy', 'Terms', 'Cookies'].map(item => (
              <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
