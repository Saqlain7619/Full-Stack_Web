import ProductCard from './ProductCard';
import Spinner from '../common/Spinner';

export default function ProductGrid({ products, loading }) {
  if (loading) return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array(8).fill(0).map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="aspect-square bg-gray-200" />
          <div className="p-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
            <div className="h-5 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );

  if (!products?.length) return (
    <div className="text-center py-20">
      <p className="text-4xl mb-4">🔍</p>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
      <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
