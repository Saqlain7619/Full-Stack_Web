import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Heart, Share2, ChevronLeft, Minus, Plus, Star } from 'lucide-react';
import api from '../api/axios';
import { addToCart } from '../store/cartSlice';
import StarRating from '../components/common/StarRating';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';
import CompleteTheLook from '../components/product/CompleteTheLook';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { token, user } = useSelector((s) => s.auth);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [review, setReview] = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => { setProduct(data.product); }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) { toast.error('Please login to add to cart'); return; }
    try { await dispatch(addToCart({ productId: product.id, quantity: qty })).unwrap(); toast.success('Added to cart!'); }
    catch (err) { toast.error(err || 'Failed to add to cart'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!token) { toast.error('Please login to review'); return; }
    setSubmitting(true);
    try {
      await api.post(`/reviews/product/${product.id}`, review);
      toast.success('Review submitted!');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
      setReview({ rating: 5, title: '', comment: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit review'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="flex justify-center py-40"><Spinner size="lg" /></div>;
  if (!product) return <div className="text-center py-40"><h2 className="text-2xl font-bold">Product not found</h2><Link to="/products" className="text-primary-600 mt-4 inline-block">Back to products</Link></div>;

  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/products" className="flex items-center gap-1 text-gray-500 hover:text-primary-600 text-sm mb-6 transition-colors"><ChevronLeft size={16} />Back to Products</Link>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="flex flex-col items-center sm:items-start lg:items-center">
          <div className="card w-full max-w-[450px] overflow-hidden aspect-square mb-4 bg-white border border-gray-100 p-4 flex items-center justify-center relative shadow-sm">
            <img src={product.images?.[activeImg] || 'https://placehold.co/600x600?text=No+Image'} alt={product.name} className="max-w-full max-h-full object-contain drop-shadow-sm transition-transform duration-500 hover:scale-105" />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-3 w-full max-w-[450px] px-1 hide-scrollbar">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 bg-white flex items-center justify-center p-1 cursor-pointer transition-all ${i === activeImg ? 'border-primary-500 shadow-md ring-2 ring-primary-500/20' : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'}`}>
                  <img src={img} alt="" className="max-w-full max-h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link to={`/products?category=${product.category?.slug}`} className="badge bg-primary-50 text-primary-700 hover:bg-primary-100">{product.category?.name}</Link>
            {product.featured && <span className="badge bg-amber-50 text-amber-700">⭐ Featured</span>}
            {product.stock === 0 && <span className="badge bg-red-50 text-red-700">Out of Stock</span>}
            {product.stock > 0 && product.stock <= 10 && <span className="badge bg-orange-50 text-orange-700">Only {product.stock} left!</span>}
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.rating} size={16} />
            <span className="text-sm text-gray-500">{product.rating?.toFixed(1)} ({product.reviewCount} reviews)</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">{product.sold} sold</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.comparePrice && <span className="text-xl text-gray-400 line-through">${product.comparePrice.toFixed(2)}</span>}
            {discount && <span className="badge bg-red-100 text-red-700 text-sm">Save {discount}%</span>}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-gray-50 transition-colors"><Minus size={16} /></button>
                <span className="w-12 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-3 hover:bg-gray-50 transition-colors"><Plus size={16} /></button>
              </div>
              <span className="text-sm text-gray-500">{product.stock} available</span>
            </div>
          )}

          <div className="flex gap-3 mb-8">
            <button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 flex items-center justify-center gap-2 btn-primary py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed">
              <ShoppingCart size={18} />{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button className="p-3.5 rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all"><Heart size={20} /></button>
            <button className="p-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"><Share2 size={20} /></button>
          </div>

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => <span key={tag} className="badge bg-gray-100 text-gray-600">#{tag}</span>)}
            </div>
          )}
        </div>
      </div>

      {/* Complete The Look */}
      <CompleteTheLook productId={product.id} categorySlug={product.category?.slug || product.categoryId} />

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="font-display font-bold text-2xl mb-8">Customer Reviews</h2>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Review Summary */}
          <div className="card p-6 text-center">
            <div className="text-6xl font-bold text-gray-900 mb-2">{product.rating?.toFixed(1)}</div>
            <StarRating rating={product.rating} size={20} />
            <p className="text-gray-500 mt-2">{product.reviewCount} reviews</p>
          </div>

          {/* Review Form */}
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4">Write a Review</h3>
            {!token ? (
              <p className="text-gray-500 text-sm">Please <Link to="/login" className="text-primary-600 font-medium">login</Link> to write a review.</p>
            ) : (
              <form onSubmit={handleReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => setReview({...review, rating: n})}>
                        <Star size={24} className={n <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                      </button>
                    ))}
                  </div>
                </div>
                <input placeholder="Review title" value={review.title} onChange={(e) => setReview({...review, title: e.target.value})} className="input-field" />
                <textarea placeholder="Share your experience..." value={review.comment} onChange={(e) => setReview({...review, comment: e.target.value})} required className="input-field resize-none h-24" />
                <button type="submit" disabled={submitting} className="w-full btn-primary">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {product.reviews?.length === 0 && <p className="text-gray-500 text-sm py-8 text-center">No reviews yet. Be the first!</p>}
            {product.reviews?.map((r) => (
              <div key={r.id} className="card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs">{r.user?.name?.[0]}</div>
                  <div>
                    <p className="font-semibold text-sm">{r.user?.name}</p>
                    <StarRating rating={r.rating} size={11} />
                  </div>
                </div>
                {r.title && <p className="font-medium text-sm mb-1">{r.title}</p>}
                <p className="text-gray-600 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
