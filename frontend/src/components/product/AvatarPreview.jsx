import { useState, useEffect } from 'react';
import { Sparkles, Loader2, Image as ImageIcon, Shirt, ShoppingBag, CheckCircle, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/formatPrice';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${cleanPath}`;
};

export default function AvatarPreview({ product, lookItems = [], selectedSize }) {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingAll, setIsAddingAll] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [error, setError] = useState(null);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [lookSizes, setLookSizes] = useState({});

  const productImg = getImageUrl(product.images?.[0]);
  const avatarImg = getImageUrl(product.avatarImage);

  const handleTryOn = () => {
    if (!product.avatarImage) {
      setError('Avatar preview not available');
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Simulate AI processing delay (700ms - 1200ms)
    const delay = Math.floor(Math.random() * (1200 - 700 + 1) + 700);
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowAvatar(true);
    }, delay);
  };

  const handleReset = () => {
    setShowAvatar(false);
    setError(null);
  };

  const handleOpenSizeModal = () => {
    if (!token) { toast.error('Please login to checkout'); return; }
    const initialSizes = {};
    if (selectedSize) initialSizes[product.id] = selectedSize;
    setLookSizes(initialSizes);
    setShowSizeModal(true);
  };

  const isAllSizesSelected = () => {
    const allItems = [product, ...lookItems];
    for (const item of allItems) {
      if (!lookSizes[item.id]) return false;
    }
    return true;
  };

  const handleCompleteLook = async () => {
    if (!isAllSizesSelected()) {
      toast.error('Please select all required sizes');
      return;
    }
    
    setIsAddingAll(true);
    try {
      const allItems = [product, ...lookItems];
      for (const item of allItems) {
        await dispatch(addToCart({ productId: item.id, quantity: 1, size: lookSizes[item.id] })).unwrap();
      }
      
      toast.success('Complete Look added to cart!');
      setShowSizeModal(false);
      setShowAvatar(false);
    } catch (err) {
      toast.error('Failed to add some items');
    } finally {
      setIsAddingAll(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Viewport Container */}
      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-50 border border-black/5 group shadow-inner">
        
        {/* Main Display Image */}
        <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${showAvatar ? 'opacity-0 scale-105 blur-sm' : 'opacity-100 scale-100'}`}>
          <img 
            src={productImg || 'https://placehold.co/600x800?text=No+Image'} 
            alt={product.name} 
            className="w-full h-full object-contain p-8 drop-shadow-xl"
          />
        </div>

        {/* Avatar Image (Fade In) */}
        {showAvatar && avatarImg && (
          <div className="absolute inset-0 animate-in fade-in duration-700 bg-white">
            <img 
              src={avatarImg} 
              alt="Avatar Try-On" 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Loading Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative">
              <Loader2 size={48} className="text-primary-600 animate-spin" />
              <Sparkles size={20} className="text-primary-400 absolute -top-2 -right-2 animate-bounce" />
            </div>
            <div className="text-center">
              <p className="text-black font-bold uppercase tracking-widest text-[11px]">Generating AI Preview...</p>
              <div className="flex gap-1 justify-center mt-2">
                <div className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}

        {/* Error / Failsafe Message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/90 backdrop-blur-sm px-6">
            <div className="text-center p-6 bg-white rounded-2xl shadow-xl border border-red-50 max-w-[200px]">
              <Shirt className="mx-auto mb-3 text-red-300" size={32} />
              <p className="text-red-600 text-sm font-medium leading-tight">
                {error}
              </p>
              <button 
                onClick={() => setError(null)}
                className="mt-4 text-[10px] items-center italic font-bold text-gray-400 hover:text-black uppercase tracking-widest underline underline-offset-4"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Active Badge */}
        {showAvatar && !isProcessing && (
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-black/80 backdrop-blur-md text-white text-[9px] font-bold rounded-full uppercase tracking-[0.2em] shadow-lg border border-white/10">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              AI Preview Mode
            </span>
            {lookItems.length > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600/90 backdrop-blur-md text-white text-[9px] font-bold rounded-full uppercase tracking-[0.2em] shadow-lg border border-white/10">
                <Sparkles size={10} />
                +{lookItems.length} items styled
              </span>
            )}
          </div>
        )}
      </div>

      {/* Selected Items List (Mini) */}
      {showAvatar && lookItems.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          <div className="w-12 h-12 rounded-lg border-2 border-primary-600 overflow-hidden flex-shrink-0 bg-white">
            <img src={getImageUrl(product.images?.[0])} className="w-full h-full object-cover" />
          </div>
          {lookItems.map(item => (
            <div key={item.id} className="w-12 h-12 rounded-lg border border-black/5 overflow-hidden flex-shrink-0 bg-white">
              <img src={getImageUrl(item.images?.[0])} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col gap-3">
        {!showAvatar ? (
          <button 
            onClick={handleTryOn}
            disabled={isProcessing}
            className="w-full relative group overflow-hidden bg-black text-white rounded-2xl py-5 px-8 font-bold flex items-center justify-center gap-4 transition-all hover:bg-primary-900 border border-black active:scale-95 disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Sparkles size={20} className={`text-primary-400 ${isProcessing ? 'animate-spin' : 'animate-pulse'}`} />
            <span className="uppercase tracking-[0.3em] text-[11px]">
              {isProcessing ? 'Processing Silhouette...' : 'Try On Avatar'}
            </span>
          </button>
        ) : (
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleOpenSizeModal}
                disabled={isAddingAll}
                className="w-full bg-black text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl hover:bg-primary-900"
              >
                {isAddingAll ? <Loader2 size={18} className="animate-spin" /> : <ShoppingBag size={18} />}
                {isAddingAll ? 'Adding Look...' : 'Complete The Look Checkout'}
              </button>
              <button 
                onClick={handleReset}
                className="w-full bg-white border border-black/5 hover:bg-gray-50 text-black py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <ImageIcon size={14} /> Back to Product Detail
              </button>
            </div>
        )}
        <p className="text-[10px] text-center text-black/30 font-medium uppercase tracking-widest">
          {showAvatar ? 'Static AI Simulation is active' : 'Virtual fitting uses pre-processed neural images'}
        </p>
      </div>

      {/* Size Selection Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-xl">Select Sizes</h3>
              <button onClick={() => setShowSizeModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              {[product, ...lookItems].map(item => {
                const isShoe = item.category?.name?.toLowerCase()?.includes('shoe');
                const sizes = isShoe ? ['6', '7', '8', '9', '10'] : ['S', 'M', 'L', 'XL'];
                return (
                  <div key={item.id} className="border border-black/10 rounded-2xl p-4 transition-all hover:border-black/20 hover:shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-black/5">
                        <img src={getImageUrl(item.images?.[0])} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-black leading-tight line-clamp-2 mb-1">{item.name}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">{item.category?.name}</p>
                        <p className="font-bold text-primary-600 text-sm">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-black/60 mb-3">
                        {isShoe ? 'Shoe Size (Required)' : 'Select Size'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setLookSizes(prev => ({...prev, [item.id]: size}))}
                            className={`w-12 h-10 flex items-center justify-center rounded-xl font-bold text-xs transition-all border ${lookSizes[item.id] === size ? 'border-black bg-black text-white shadow-md' : 'border-black/10 text-black hover:border-black/30'}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 pt-6 border-t border-black/10">
              <button
                onClick={handleCompleteLook}
                disabled={!isAllSizesSelected() || isAddingAll}
                className={`w-full py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all ${!isAllSizesSelected() ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-black text-white shadow-xl hover:bg-primary-900 hover:-translate-y-1'}`}
              >
                {isAddingAll ? <Loader2 size={18} className="animate-spin" /> : <ShoppingBag size={18} />}
                {isAddingAll ? 'Adding to Order...' : 'Place Order'}
              </button>
              {!isAllSizesSelected() && (
                <p className="text-red-500/80 text-[10px] text-center mt-3 uppercase tracking-widest font-bold animate-pulse">
                  Please select all required sizes
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
