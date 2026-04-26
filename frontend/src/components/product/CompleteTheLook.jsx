import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus, Sparkles, ChevronRight } from 'lucide-react';
import api from '../../api/axios';
import Spinner from '../common/Spinner';
import { getImageUrl } from '../../utils/imageUrl';
import { formatPrice } from '../../utils/formatPrice';

export default function CompleteTheLook({ productId, categorySlug, onSelectForLook, selectedItems }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSmartRecommendations = async () => {
      try {
        setLoading(true);
        // 1. Check for manual recommendations first
        const { data: manualData } = await api.get(`/recommendations/${productId}`);
        
        if (manualData.products && manualData.products.length > 0) {
          setRecommendations(manualData.products.slice(0, 3));
          return;
        }

        // 2. Smart Logic based on Category
        const lowerSlug = categorySlug?.toLowerCase() || '';
        let targetCategories = [];
        let limit = 2;

        if (lowerSlug.includes('dress')) {
          targetCategories = ['-shoes'];
          limit = 1;
        } else if (lowerSlug.includes('top') || lowerSlug.includes('shirt')) {
          targetCategories = ['-bottom', '-shoes'];
          limit = 2;
        } else if (lowerSlug.includes('bottom') || lowerSlug.includes('pant')) {
          targetCategories = ['-top', '-shoes'];
          limit = 2;
        } else if (lowerSlug.includes('shoes')) {
          targetCategories = ['-dress', '-top'];
          limit = 2;
        } else {
          // General fallback
          targetCategories = ['-shoes', '-bottom', '-top'];
          limit = 3;
        }

        // Fetch products from targeted categories
        const fetchPromises = targetCategories.map(cat => 
          api.get(`/products?category=${cat}&limit=1`).catch(() => ({ data: { products: [] } }))
        );
        
        const results = await Promise.all(fetchPromises);
        const smartProducts = results.flatMap(r => r.data.products || []).filter(p => p.id !== productId);
        
        if (smartProducts.length > 0) {
          setRecommendations(smartProducts.slice(0, limit));
        } else {
          // Absolute fallback
          const fallbackData = await api.get(`/products?limit=4`);
          setRecommendations((fallbackData.data.products || []).filter(p => p.id !== productId).slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchSmartRecommendations();
    }
  }, [productId, categorySlug]);

  if (loading) return (
    <div className="py-20 flex justify-center bg-luxury-gray/30 rounded-3xl mt-12">
      <Spinner size="md" />
    </div>
  );

  if (!recommendations || recommendations.length === 0) return null;

  const isSingle = recommendations.length === 1;

  return (
    <div className="mt-16 sm:mt-24 mb-16 overflow-hidden rounded-3xl bg-gradient-to-b from-luxury-gray/50 to-white border border-black/5">
      <div className="px-6 py-12 sm:px-12 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={16} className="text-primary-600 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-600">Style Recommendation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-black tracking-tight">Complete The Look</h2>
          </div>
          <p className="text-black/40 text-sm max-w-xs font-medium leading-relaxed">
            Curated by our AI stylists to perfectly complement your current selection.
          </p>
        </div>

        <div className={`grid gap-8 ${isSingle ? 'place-items-center' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
          {recommendations.map((product) => (
            <LookProductCard 
              key={product.id} 
              product={product} 
              onSelect={() => onSelectForLook && onSelectForLook(product)}
              isSelected={selectedItems?.some(i => i.id === product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function LookProductCard({ product, onSelect, isSelected }) {
  return (
    <div className={`group relative w-full max-w-[320px] bg-white rounded-2xl overflow-hidden border transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 ${isSelected ? 'border-primary-500 ring-1 ring-primary-500' : 'border-black/5'}`}>
      <div className="flex items-center p-4 gap-5">
        {/* Image */}
        <div className="relative w-24 h-32 flex-shrink-0 bg-luxury-cream rounded-xl overflow-hidden">
          <img 
            src={getImageUrl(product.images?.[0])} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {isSelected && (
            <div className="absolute inset-0 bg-primary-600/20 flex items-center justify-center">
              <div className="bg-white rounded-full p-1 shadow-lg">
                <Plus className="text-primary-600 rotate-45" size={12} />
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col h-full py-1">
          <p className="text-[9px] uppercase tracking-widest font-bold text-black/30 mb-1">
            {product.category?.name?.replace(/[^a-zA-Z]/g, '') || 'Piece'}
          </p>
          <h3 className="font-display font-bold text-sm text-black leading-tight mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="font-display font-bold text-primary-700 text-sm mb-3">
            {formatPrice(product.price)}
          </p>
          
          <button 
            onClick={(e) => { e.preventDefault(); onSelect(); }}
            className={`mt-auto w-full py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isSelected ? 'bg-black text-white' : 'bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white'}`}
          >
            {isSelected ? (
              <>Selected <ShoppingBag size={12} /></>
            ) : (
              <>Try With Look <Plus size={12} /></>
            )}
          </button>
        </div>
      </div>
      
      <Link to={`/catalog/${product.slug || product.id}`} className="absolute top-2 right-2 p-1.5 bg-black/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/10">
        <ChevronRight size={14} className="text-black" />
      </Link>
    </div>
  );
}
