import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
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
    <div className="group card-premium flex flex-col h-full bg-white transition-all duration-500 hover:-translate-y-2">
      {/* Image Viewport */}
      <div className="relative aspect-[3/4] overflow-hidden bg-luxury-cream">
        <Link to={`/products/${product.slug || product.id}`} className="block w-full h-full">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            onError={(e) => { e.target.src = 'https://placehold.co/600x800?text=FASH+FIT'; }}
          />
        </Link>
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {discount && (
            <span className="bg-primary-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
              -{discount}% OFF
            </span>
          )}
          {product.featured && (
            <span className="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Star size={10} className="fill-primary-600 text-primary-600" /> NEW
            </span>
          )}
        </div>

        {/* Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex gap-2">
          <Link 
            to={`/products/${product.slug || product.id}`}
            className="flex-1 bg-black text-white text-[11px] font-bold py-3 rounded-lg text-center hover:bg-primary-600 transition-colors uppercase tracking-widest shadow-xl"
          >
            Virtual Fitting
          </Link>
          <button 
            onClick={handleAddToCart}
            className="w-11 h-11 bg-white text-black rounded-lg flex items-center justify-center hover:text-primary-600 transition-colors shadow-xl"
          >
            <ShoppingCart size={18} />
          </button>
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-black hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          <Heart size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">
            {product.category?.name || 'Collection'}
          </p>
          <div className="flex items-center gap-1">
            <Star size={10} className="fill-primary-600 text-primary-600" />
            <span className="text-[10px] font-bold">{product.rating || '4.8'}</span>
          </div>
        </div>

        <Link to={`/products/${product.slug || product.id}`} className="block mb-3">
          <h3 className="font-display font-semibold text-base text-black leading-tight group-hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto flex items-center gap-3">
          <span className="font-display font-bold text-lg text-black">
            ${product.price.toFixed(2)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-black/30 line-through">
              ${product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}