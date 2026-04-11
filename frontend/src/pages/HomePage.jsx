import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw, Headphones, Star, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/product/ProductCard';
import Spinner from '../components/common/Spinner';
import { getImageUrl } from '../utils/imageUrl';

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-orange-50/50">
        {/* Background Accents */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-2xl z-10">
              <div className="inline-flex items-center gap-2 bg-white border border-primary-100 shadow-sm rounded-full px-3 py-1.5 text-sm text-primary-700 mb-4 font-medium animate-fade-in">
                <Star size={14} className="fill-primary-500 text-primary-500" />
                <span>The New Premium Collection</span>
              </div>
              
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.15] text-gray-900 mb-4">
                Redefine Your<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-orange-400">Everyday Style.</span>
              </h1>
              
              <p className="text-gray-600 text-base sm:text-lg mb-6 leading-relaxed max-w-lg">
                Discover our meticulously curated collection of premium products. Designed to make you stand out and feel exceptional.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-primary-600/30 transition-all hover:-translate-y-1">
                  Explore Collection <ArrowRight size={18} />
                </Link>
                <Link to="/products?featured=true" className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-bold px-6 py-3 rounded-xl shadow-sm border border-gray-200 transition-all hover:-translate-y-1">
                  View Lookbook
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-4">
                  {[1,2,3].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+20}`} alt="Customer" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-600 shadow-sm">+9k</div>
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-amber-400 mb-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-current" />)}
                  </div>
                  <p className="text-gray-600 text-xs font-medium">Loved by 50k+ customers</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative mt-12 lg:mt-0 z-10 w-full max-w-sm sm:max-w-md mx-auto lg:max-w-[400px]">
              {/* Main Image */}
              <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl aspect-square sm:aspect-[4/5] object-cover max-h-[380px] lg:max-h-[440px] z-10 border-4 sm:border-8 border-white bg-white">
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop" alt="Premium Fashion Collection" className="w-full h-full object-cover object-top" />
              </div>
              
              {/* Floating Element 1 - Left */}
              <div className="absolute top-8 sm:top-12 -left-4 sm:-left-10 bg-white p-2 sm:p-3 rounded-xl shadow-xl z-20 flex items-center gap-2 sm:gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Shield size={16} />
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium">100% Authentic</p>
                  <p className="font-bold text-gray-900 text-xs sm:text-sm">Guaranteed</p>
                </div>
              </div>
              
              {/* Floating Element 2 - Right */}
              <div className="absolute bottom-8 sm:bottom-16 -right-4 sm:-right-8 bg-white p-2 sm:p-3 rounded-xl shadow-xl z-20 flex items-center gap-2 sm:gap-3 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                  <Star size={16} className="fill-current" />
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium">Top Rated</p>
                  <p className="font-bold text-gray-900 text-xs sm:text-sm">4.9/5 Stars</p>
                </div>
              </div>
              
              {/* Decorative Blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary-200/50 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
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
          <Link to="/products" className="flex items-center gap-1 text-primary-600 font-medium text-sm hover:gap-2 transition-all">
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
              <Link key={cat.id} to={`/products?category=${cat.slug}`}
                className="group card relative overflow-hidden aspect-[4/5] hover:shadow-xl transition-all duration-300 hover:-translate-y-2 rounded-2xl">
                <img src={cat.image ? getImageUrl(cat.image) : 'https://placehold.co/400x500?text=' + cat.name} alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <h3 className="text-white font-display font-bold text-lg sm:text-xl leading-tight mb-1">{cat.name}</h3>
                  <p className="text-gray-300 text-sm font-medium">{cat._count?.products || 0} items</p>
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
            <Link to="/products?featured=true" className="flex items-center gap-1 text-primary-600 font-medium text-sm hover:gap-2 transition-all">
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
