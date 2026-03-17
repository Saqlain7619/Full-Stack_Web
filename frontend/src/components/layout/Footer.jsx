import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-400 pt-16 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary-600 p-1.5 rounded-lg"><ShoppingBag className="text-white" size={20} /></div>
              <span className="text-white font-display font-bold text-xl">ShopNow</span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">Your modern e-commerce destination. Quality products, fast delivery, exceptional service.</p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <Icon size={14} className="text-white" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              {['All Products', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'].map(item => (
                <li key={item}><Link to="/products" className="hover:text-primary-400 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              {[['My Profile', '/profile'], ['My Orders', '/orders'], ['Shopping Cart', '/cart'], ['Login', '/login'], ['Register', '/register']].map(([label, path]) => (
                <li key={label}><Link to={path} className="hover:text-primary-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><MapPin size={14} /><span>123 Commerce St, NY 10001</span></li>
              <li className="flex items-center gap-2"><Phone size={14} /><span>+1 (555) 123-4567</span></li>
              <li className="flex items-center gap-2"><Mail size={14} /><span>hello@shopnow.com</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">© 2025 ShopNow. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" className="hover:text-primary-400 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
