import React from 'react';
import { Check } from 'lucide-react';

const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/100x100';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${cleanPath}`;
};

export default function RecommendationSelector({ products, selected, onChange }) {
  const toggleSelection = (productId) => {
    const isSelected = selected.includes(productId);
    if (isSelected) {
      onChange(selected.filter(id => id !== productId));
    } else {
      onChange([...selected, productId]);
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <p className="text-gray-500 text-sm italic">
          No recommendation products available for this category
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2 max-h-96 overflow-y-auto p-2">
      {products.map((product) => {
        const isSelected = selected.includes(product.id);
        return (
          <div
            key={product.id}
            onClick={() => toggleSelection(product.id)}
            className={`
              relative cursor-pointer group rounded-xl overflow-hidden border-2 transition-all duration-200
              ${isSelected ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-200 hover:border-primary-400 hover:shadow-md'}
            `}
          >
            <div className="aspect-square relative overflow-hidden bg-gray-100">
              <img
                src={getImageUrl(product.images?.[0])}
                alt={product.name}
                loading="lazy"
                className={`
                  w-full h-full object-cover transition-transform duration-300
                  ${isSelected ? 'scale-105' : 'group-hover:scale-110'}
                `}
                onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
              />
              
              {isSelected && (
                <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg z-10 animate-in zoom-in duration-200">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className={`p-2 ${isSelected ? 'bg-red-50' : 'bg-white'}`}>
              <p className={`text-[11px] font-bold truncate ${isSelected ? 'text-red-700' : 'text-gray-700'}`}>
                {product.name}
              </p>
              <p className="text-[9px] text-gray-500">{product.category?.name}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
