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
import AvatarPreview from '../components/product/AvatarPreview';
import { Sparkles } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { token, user } = useSelector((s) => s.auth);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [lookItems, setLookItems] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [review, setReview] = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolledPast(window.scrollY > 800);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => { setProduct(data.product); }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) { toast.error('Please login to add to cart'); return; }
    if (!selectedSize) { toast.error('Please select a size'); return; }
    try { await dispatch(addToCart({ productId: product.id, quantity: qty, size: selectedSize })).unwrap(); toast.success('Added to cart!'); }
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
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-8">
      <Link to="/catalog" className="flex items-center gap-2 text-black/40 hover:text-primary-600 text-[10px] font-bold uppercase tracking-widest mb-6 transition-colors group">
        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Catalog
      </Link>

      <div className={`grid gap-8 lg:gap-16 transition-all duration-700 ${showTryOn ? 'lg:grid-cols-[1fr,1.3fr,1.2fr]' : 'lg:grid-cols-2'}`}>
        
        {/* Left: Images */}
        <div className="lg:sticky lg:top-24 h-fit flex flex-col items-center">
          <div className="card-premium w-full aspect-square max-h-[420px] sm:max-h-[480px] overflow-hidden mb-4 bg-white p-6 sm:p-8 flex items-center justify-center relative rounded-3xl shadow-lg border border-black/5">
            <img 
              src={product.images?.[activeImg] || 'https://placehold.co/600x800?text=No+Image'} 
              alt={product.name} 
              className="max-w-[90%] max-h-[90%] object-contain mix-blend-multiply transition-all duration-700 hover:scale-105" 
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
        <div className="space-y-6 pt-2">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Link to={`/catalog?category=${product.category?.slug}`} className="text-[9px] uppercase tracking-[0.2em] font-bold text-primary-600 hover:underline">{product.category?.name}</Link>
              {product.featured && <span className="bg-black text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Featured</span>}
            </div>

            <h1 className="font-display font-medium text-2xl sm:text-3xl lg:text-4xl text-black mb-3 leading-tight tracking-tight">{product.name}</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                <StarRating rating={product.rating} size={14} />
                <span className="text-xs font-bold text-black">{product.rating?.toFixed(1)}</span>
              </div>
              <span className="text-black/10">|</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">{product.reviewCount} reviews</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">{product.sold} sold</span>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl sm:text-4xl font-display font-bold text-black">{formatPrice(product.price)}</span>
              {product.comparePrice && <span className="text-lg sm:text-xl text-black/20 line-through font-light">{formatPrice(product.comparePrice)}</span>}
            </div>

            <p className="text-black/60 text-base leading-relaxed mb-6 font-light max-w-xl">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-black">Select Size</span>
                <button className="text-[10px] font-bold text-primary-600 uppercase tracking-widest hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {(product.category?.name?.toLowerCase()?.includes('shoe') ? ['6', '7', '8', '9', '10'] : ['S', 'M', 'L', 'XL']).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[56px] h-14 flex items-center justify-center rounded-xl font-bold transition-all border-2 ${selectedSize === size ? 'border-black bg-black text-white shadow-lg' : 'border-black/5 text-black hover:border-black/20'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {product.stock > 0 && (
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center border border-black/5 rounded-xl bg-white shadow-sm overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-black/5 transition-colors"><Minus size={16} /></button>
                  <span className="w-12 text-center font-bold">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-3 hover:bg-black/5 transition-colors"><Plus size={16} /></button>
                </div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-black/40">
                  {product.stock} units left
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button 
                  onClick={handleAddToCart} 
                  disabled={product.stock === 0} 
                  className="flex-[3] btn-primary flex items-center justify-center gap-3 py-4 text-xs uppercase tracking-[0.2em]"
                >
                  <ShoppingCart size={18} />
                  {product.stock === 0 ? 'Sold Out' : 'Add to Bag'}
                </button>
                <button className="flex-1 btn-secondary flex items-center justify-center gap-2 group !py-4">
                  <Heart size={18} className="group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
                </button>
              </div>

              {!showTryOn && (
                <button 
                  onClick={() => setShowTryOn(true)} 
                  className="w-full relative group overflow-hidden bg-black text-white rounded-xl py-4 px-6 font-bold flex items-center justify-center gap-3 transition-all hover:bg-primary-900 border border-black"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <Sparkles size={18} className="text-primary-400 animate-pulse" />
                  <span className="uppercase tracking-[0.2em] text-[10px]">Virtual Fitting Room</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Try-On Panel */}
        {showTryOn && (
          <div className="lg:sticky lg:top-32 h-fit z-20">
            <div className="card-premium overflow-hidden p-6 sm:p-8 bg-luxury-cream/30 backdrop-blur-xl border border-primary-100/50 shadow-premium rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-xl">Virtual Fitting Room</h3>
                <button 
                  onClick={() => setShowTryOn(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                >
                  <ChevronLeft size={20} className="rotate-180" />
                </button>
              </div>
              <AvatarPreview product={product} lookItems={lookItems} />
            </div>
          </div>
        )}
      </div>

      {/* Complete The Look */}
      <CompleteTheLook 
        productId={product.id} 
        categorySlug={product.category?.slug || product.categoryId} 
        onSelectForLook={(p) => {
          if (lookItems.find(i => i.id === p.id)) {
            setLookItems(lookItems.filter(i => i.id !== p.id));
          } else {
            setLookItems([...lookItems, p]);
          }
        }}
        selectedItems={lookItems}
      />

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="font-display font-bold text-2xl mb-8">Customer Reviews</h2>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Review Summary */}
          <div className="card-premium p-8 text-center bg-luxury-cream/20 flex flex-col items-center justify-center border-none">
            <div className="text-7xl font-display font-bold text-black mb-3 tracking-tighter">{product.rating?.toFixed(1)}</div>
            <StarRating rating={product.rating} size={20} />
            <p className="text-black/40 text-[10px] font-bold uppercase tracking-widest mt-4">{product.reviewCount} total reviews</p>
          </div>

          {/* Review Form */}
          <div className="card-premium p-8 bg-white border border-black/5 shadow-sm">
            <h3 className="font-display font-bold text-xl mb-6 tracking-tight">Post a Review</h3>
            {!token ? (
              <p className="text-black/40 text-sm italic py-4">Please <Link to="/login" className="text-primary-600 font-bold underline">login</Link> to share your experience.</p>
            ) : (
              <form onSubmit={handleReview} className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-black/60">Rating</span>
                  <div className="flex gap-1.5">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => setReview({...review, rating: n})} className="transition-transform active:scale-90">
                        <Star size={20} className={n <= review.rating ? 'fill-primary-600 text-primary-600' : 'text-black/10'} />
                      </button>
                    ))}
                  </div>
                </div>
                <input placeholder="Short Title" value={review.title} onChange={(e) => setReview({...review, title: e.target.value})} className="input-field !bg-luxury-gray !border-none !rounded-2xl" />
                <textarea placeholder="Tell us more about the fit and quality..." value={review.comment} onChange={(e) => setReview({...review, comment: e.target.value})} required className="input-field !bg-luxury-gray !border-none !rounded-2xl resize-none h-28" />
                <button type="submit" disabled={submitting} className="w-full btn-primary !rounded-2xl !py-4 text-[11px] uppercase tracking-[0.2em]">
                  {submitting ? 'Sending...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-6 lg:max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {product.reviews?.length === 0 && (
              <div className="text-center py-12 bg-luxury-gray/50 rounded-3xl border border-dashed border-black/10">
                <p className="text-black/30 text-sm font-medium">No reviews yet. Be the first to wear it!</p>
              </div>
            )}
            {product.reviews?.map((r) => (
              <div key={r.id} className="p-6 bg-white border border-black/5 rounded-3xl transition-all hover:shadow-premium group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-luxury-cream rounded-full flex items-center justify-center text-primary-700 font-bold text-sm shadow-inner group-hover:scale-110 transition-transform">
                    {r.user?.name?.[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-black">{r.user?.name}</p>
                    <StarRating rating={r.rating} size={10} />
                  </div>
                </div>
                {r.title && <h4 className="font-display font-bold text-sm mb-2 text-black">{r.title}</h4>}
                <p className="text-black/60 text-sm leading-relaxed italic">"{r.comment}"</p>
              </div>
            ))}
          </div>
        </div>
        </div>

      {/* Floating Mobile Action Bar */}
      <div className={`fixed bottom-0 inset-x-0 z-[100] p-4 lg:hidden transition-all duration-500 transform ${scrolledPast ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <div className="bg-white/80 backdrop-blur-2xl border border-black/5 rounded-3xl p-4 shadow-2xl flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest leading-none mb-1">Total</span>
            <span className="font-display font-bold text-lg leading-none">{formatPrice(product.price)}</span>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold"
          >
            <ShoppingCart size={16} />
            {product.stock === 0 ? 'Sold Out' : 'Add to Bag'}
          </button>
        </div>
      </div>
    </div>
  );
}
