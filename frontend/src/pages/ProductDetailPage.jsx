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
import AvatarTryOn from '../components/TryOn/AvatarTryOn';
import { Sparkles } from 'lucide-react';

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
  const [showTryOn, setShowTryOn] = useState(false);

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
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-10">
      <Link to="/products" className="flex items-center gap-2 text-black/40 hover:text-primary-600 text-[11px] font-bold uppercase tracking-widest mb-10 transition-colors group">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Products
      </Link>

      <div className={`grid gap-12 transition-all duration-700 ${showTryOn ? 'lg:grid-cols-[1fr,1.2fr,1.3fr]' : 'lg:grid-cols-2'}`}>
        
        {/* Left: Images */}
        <div className="sticky top-32 h-fit flex flex-col items-center">
          <div className="card-premium w-full aspect-[3/4] overflow-hidden mb-6 bg-white p-6 flex items-center justify-center relative">
            <img 
              src={product.images?.[activeImg] || 'https://placehold.co/600x800?text=No+Image'} 
              alt={product.name} 
              className="max-w-full max-h-full object-contain drop-shadow-2xl transition-all duration-700 hover:scale-110" 
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 w-full px-1 hide-scrollbar">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImg(i)} 
                  className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 bg-white flex items-center justify-center p-2 cursor-pointer transition-all ${i === activeImg ? 'border-primary-600 shadow-premium' : 'border-black/5 opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="max-w-full max-h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Middle: Details */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Link to={`/products?category=${product.category?.slug}`} className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary-600 hover:underline">{product.category?.name}</Link>
              {product.featured && <span className="bg-black text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter">Featured</span>}
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl text-black mb-6 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1.5">
                <StarRating rating={product.rating} size={16} />
                <span className="text-sm font-bold text-black">{product.rating?.toFixed(1)}</span>
              </div>
              <span className="text-black/10">|</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-black/40">{product.reviewCount} reviews</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-black/40">{product.sold} sold</span>
            </div>

            <div className="flex items-baseline gap-4 mb-10">
              <span className="text-5xl font-display font-bold text-black">${product.price.toFixed(2)}</span>
              {product.comparePrice && <span className="text-2xl text-black/20 line-through font-light">${product.comparePrice.toFixed(2)}</span>}
            </div>

            <p className="text-black/60 text-lg leading-relaxed mb-10 font-light">{product.description}</p>

            {product.stock > 0 && (
              <div className="flex items-center gap-8 mb-10">
                <div className="flex items-center border border-black/5 rounded-xl bg-white shadow-sm overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-4 hover:bg-black/5 transition-colors"><Minus size={18} /></button>
                  <span className="w-14 text-center font-bold text-lg">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-4 hover:bg-black/5 transition-colors"><Plus size={18} /></button>
                </div>
                <div className="text-[11px] uppercase tracking-widest font-bold text-black/40">
                  {product.stock} units available
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart} 
                  disabled={product.stock === 0} 
                  className="flex-[2.5] btn-primary flex items-center justify-center gap-3 py-5 text-sm uppercase tracking-[0.2em]"
                >
                  <ShoppingCart size={20} />
                  {product.stock === 0 ? 'Sold Out' : 'Add to Bag'}
                </button>
                <button className="flex-1 btn-secondary flex items-center justify-center gap-2 group !py-5">
                  <Heart size={20} className="group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
                </button>
              </div>

              {!showTryOn && (
                <button 
                  onClick={() => setShowTryOn(true)} 
                  className="w-full relative group overflow-hidden bg-black text-white rounded-xl py-5 px-8 font-bold flex items-center justify-center gap-4 transition-all hover:bg-primary-900 border border-black"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <Sparkles size={22} className="text-primary-400 animate-pulse" />
                  <span className="uppercase tracking-[0.3em] text-[11px]">Personal Virtual Fitting</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Try-On Panel */}
        {showTryOn && (
          <div className="sticky top-32 h-[calc(100vh-160px)] z-20">
            <div className="h-full card-premium overflow-hidden">
              <AvatarTryOn 
                product={product} 
                onClose={() => setShowTryOn(false)} 
              />
            </div>
          </div>
        )}
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
