import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import toast from 'react-hot-toast';
import StarRating from '../common/StarRating';
import { getImageUrl } from '../../utils/imageUrl'; // ✅ ADD

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!token) { toast.error('Please login to add items to cart'); return; }
    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      toast.success('Added to cart!');
    } catch (err) { toast.error(err || 'Failed to add to cart'); }
  };

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

  return (
    <Link to={`/products/${product.slug || product.id}`} className="group card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden aspect-square bg-gray-50">

        {/* ✅ FIXED: getImageUrl() wrap kiya */}
        <img
          src={getImageUrl(product.images?.[0])}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
        />

        {discount && (
          <span className="absolute top-3 left-3 badge bg-red-500 text-white">-{discount}%</span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="badge bg-gray-800 text-white text-sm px-3 py-1">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-500 transition-colors">
            <Heart size={14} />
          </button>
        </div>
        {product.stock > 0 && (
          <button onClick={handleAddToCart} className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-primary-600 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap shadow-lg hover:bg-primary-700">
            <ShoppingCart size={14} /> Add to Cart
          </button>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-primary-600 font-medium mb-1">{product.category?.name}</p>
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">{product.name}</h3>
        <div className="flex items-center gap-1 mb-3">
          <StarRating rating={product.rating} size={12} />
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
          {product.comparePrice && (
            <span className="text-sm text-gray-400 line-through">${product.comparePrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}