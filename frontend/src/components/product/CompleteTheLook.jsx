import { useState, useEffect } from 'react';
import api from '../../api/axios';
import ProductCard from './ProductCard';
import Spinner from '../common/Spinner';
import { Sparkles } from 'lucide-react'; // Added icon

export default function CompleteTheLook({ productId, categorySlug }) {
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
    <div className="mt-16 bg-gradient-to-br from-primary-50 to-orange-50/30 p-6 sm:p-8 rounded-3xl border border-primary-100 shadow-sm relative overflow-hidden">
      {/* Decorative blurred blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200/40 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>

      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-primary-500" size={24} />
        <h2 className="text-2xl font-bold text-gray-900 font-display">Complete The Look</h2>
      </div>
      
      <p className="text-gray-600 mb-6 text-sm">Perfect pairings selected just for you.</p>

      {/* Grid view limits width & ensures consistent height without bizarre stretching */}
      <div className="flex overflow-x-auto gap-5 pb-4 snap-x hide-scrollbar items-start">
        {recommendations.map((product) => (
          <div key={product.id} className="w-[180px] sm:w-[220px] snap-start flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
