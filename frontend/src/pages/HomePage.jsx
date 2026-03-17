import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw, Headphones, Star, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/product/ProductCard';
import Spinner from '../components/common/Spinner';

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
    Promise.all([api.get('/products/featured'), api.get('/categories')]).then(([prod, cat]) => {
      setFeatured(prod.data.products);
      setCategories(cat.data.categories);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark via-gray-900 to-gray-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary-600/20 border border-primary-500/30 rounded-full px-4 py-2 text-sm text-primary-300 mb-6">
              <Star size={14} className="fill-primary-400 text-primary-400" />
              <span>Trusted by 50,000+ customers worldwide</span>
            </div>
            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6">
              Shop the<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200">Future</span> Today
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl mb-8 leading-relaxed">
              Discover thousands of premium products at unbeatable prices. Fast delivery, easy returns, exceptional quality.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all active:scale-95">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/products?featured=true" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-all border border-white/20">
                View Featured
              </Link>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array(6).fill(0).map((_, i) => <div key={i} className="card animate-pulse aspect-[3/4] bg-gray-100" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((cat) => (
              <Link key={cat.id} to={`/products?category=${cat.slug}`}
                className="group card relative overflow-hidden aspect-[3/4] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <img src={cat.image || 'https://placehold.co/300x400?text=' + cat.name} alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-bold text-sm leading-tight">{cat.name}</h3>
                  <p className="text-gray-300 text-xs">{cat._count?.products || 0} items</p>
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
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Banner CTA */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0"><div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" /></div>
          <div className="relative">
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-3">Get 20% Off Your First Order</h2>
            <p className="text-primary-100 text-lg mb-8">Sign up today and unlock exclusive deals and personalized recommendations.</p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-all active:scale-95">
              Get Started Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
