import { useState, useEffect } from 'react';
import api from '../../api/axios';
import ProductCard from './ProductCard';
import Spinner from '../common/Spinner';
import { Sparkles } from 'lucide-react'; // Added icon

export default function CompleteTheLook({ productId, categorySlug, onSelectForLook, selectedItems }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/recommendations/${productId}`);
        
        if (data.products && data.products.length > 0) {
          setRecommendations(data.products);
        } else {
          // Fallback logic: Show products from same category if provided, otherwise generic
          const fallbackUrl = categorySlug && categorySlug !== 'undefined' 
            ? `/products?category=${categorySlug}&limit=5` 
            : `/products?limit=5`;
          const fallbackData = await api.get(fallbackUrl);
          const filteredFallback = (fallbackData.data.products || []).filter(p => p.id !== productId);
          setRecommendations(filteredFallback);
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchRecommendations();
    }
  }, [productId, categorySlug]);

  if (loading) return <Spinner size="md" className="py-8" />;

  // Display even if empty for debug/validation purpose, optionally could show a placeholder
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="mt-16 border-t border-gray-200 pt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">Complete The Look</h2>
        <p className="text-gray-500">No suggestions available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="mt-24 border-t border-black/5 pt-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-4 bg-primary-600 rounded-full" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-600">Curated Styling</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-black">Complete The Look</h2>
        </div>
        <p className="text-black/40 text-sm max-w-xs font-medium">
          Our stylists have handpicked these pieces to perfectly complement your selection.
        </p>
      </div>
      
      <div className="relative group">
        <div className="flex overflow-x-auto gap-8 pb-10 snap-x hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {recommendations.map((product) => (
            <div key={product.id} className="w-[280px] snap-start flex-shrink-0 flex flex-col">
              <ProductCard product={product} />
              <button 
                onClick={() => onSelectForLook && onSelectForLook(product)}
                className={`mt-4 w-full py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedItems?.some(i => i.id === product.id) ? 'bg-primary-600 text-white shadow-lg' : 'bg-luxury-gray text-black hover:bg-black hover:text-white'}`}
              >
                {selectedItems?.some(i => i.id === product.id) ? 'Selected for Look' : 'Try with this'}
              </button>
            </div>
          ))}
        </div>
        
        {/* Subtle Scroll Hint */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-full bg-gradient-to-l from-white to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
