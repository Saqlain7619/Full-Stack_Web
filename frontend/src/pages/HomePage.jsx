import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw, Headphones, Star, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/product/ProductCard';
import Spinner from '../components/common/Spinner';
import { getImageUrl } from '../utils/imageUrl';

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over Rs. 5000' },
  { icon: Shield, title: 'Secure Payment', desc: '100% protected' },
  { icon: RefreshCw, title: '30-Day Returns', desc: 'Hassle-free returns' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products/featured').catch(() => ({ data: { products: [] } })),
      api.get('/categories').catch(() => ({ data: { categories: [] } }))
    ]).then(([prod, cat]) => {
      setFeatured(prod.data?.products || []);
      setCategories(cat.data?.categories || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── Luxury Hero Banner ── */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-black">
        {/* Background Overlay Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2000&auto=format&fit=crop" 
            alt="Luxury Fashion" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full pt-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold text-white mb-8 animate-fade-in">
              <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-pulse" />
              Est. 2024 • Premium Collection
            </div>
            
            <h1 className="font-display font-bold text-4xl sm:text-7xl lg:text-8xl text-white mb-6 leading-none">
              Modern <br />
              <span className="text-primary-600">Elegance.</span>
            </h1>
            
            <p className="text-gray-300 text-lg sm:text-xl mb-10 leading-relaxed font-light max-w-lg">
              Redefine your wardrobe with our curation of high-end fashion pieces designed for those who command excellence.
            </p>
            
            <div className="flex flex-wrap gap-5">
              <Link to="/catalog" className="btn-primary flex items-center gap-3 group">
                Shop Collection 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/catalog?featured=true" className="btn-secondary !bg-transparent !text-white !border-white/30 hover:!bg-white hover:!text-black group">
                View Lookbook
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* ── Features Refined ── */}
      <section className="py-12 bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <div className="flex flex-wrap justify-center gap-10 lg:gap-20">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center gap-2 group">
                <div className="w-8 h-8 flex items-center justify-center text-primary-600 mb-1 group-hover:scale-110 transition-transform">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <p className="text-[11px] uppercase tracking-widest font-bold text-black">{title}</p>
                <p className="text-[10px] text-black/40 font-medium">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-primary-600 font-medium text-sm mb-1">Browse by</p>
            <h2 className="font-display font-bold text-3xl text-gray-900">Categories</h2>
          </div>
          <Link to="/catalog" className="flex items-center gap-1 text-primary-600 font-medium text-sm hover:gap-2 transition-all">
            View all <ChevronRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {Array(4).fill(0).map((_, i) => <div key={i} className="card animate-pulse aspect-[4/5] bg-gray-100 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {(categories || []).slice(0, 4).map((cat) => (
              <Link key={cat.id} to={`/catalog?category=${cat.slug}`}
                className="group card relative overflow-hidden aspect-[4/5] hover:shadow-xl transition-all duration-300 hover:-translate-y-2 rounded-2xl">
                <img src={cat.image ? getImageUrl(cat.image) : 'https://placehold.co/400x500?text=' + cat.name} alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  <h3 className="text-white font-display font-bold text-xl sm:text-2xl leading-tight mb-2">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-white/80 text-xs sm:text-sm mb-3 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-light leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                  <p className="text-primary-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">{cat._count?.products || 0} items</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-primary-600 font-medium text-sm mb-1">Handpicked for you</p>
              <h2 className="font-display font-bold text-3xl text-gray-900">Featured Products</h2>
            </div>
            <Link to="/catalog?featured=true" className="flex items-center gap-1 text-primary-600 font-medium text-sm hover:gap-2 transition-all">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          {loading ? <Spinner size="lg" className="py-20" /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {(featured || []).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Banner CTA */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-gray-900 shadow-2xl group">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop" 
              alt="Shopping aesthetic"
              className="w-full h-full object-cover opacity-50 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent" />
          </div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center p-8 sm:p-12 lg:p-16">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-primary-600/20 border border-primary-500/30 rounded-full px-3 py-1.5 text-xs text-primary-400 mb-6 font-medium uppercase tracking-wider backdrop-blur-sm">
                <Star size={12} className="fill-current" />
                <span>Special Member Offer</span>
              </div>
              <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-4 leading-[1.15]">
                Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-orange-300">20% Off</span><br />Your First Order
              </h2>
              <p className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed max-w-md">
                Join our exclusive insider list. Get early access to new drops, personalized style recommendations, and member-only discounts.
              </p>
              
              <div className="inline-block bg-white/10 p-1.5 rounded-2xl backdrop-blur-md border border-white/20 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="flex-1 bg-transparent px-4 sm:px-5 py-3.5 text-white placeholder:text-gray-400 focus:outline-none w-full sm:w-64"
                  />
                  <Link to="/register" className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-primary-600/30 active:scale-95 whitespace-nowrap">
                    Subscribe <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-4 pl-2">*No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
