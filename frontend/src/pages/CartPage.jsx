import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { fetchCart, updateCartItem, removeFromCart, selectCartTotal } from '../store/cartSlice';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((s) => s.cart);
  const { token } = useSelector((s) => s.auth);
  const subtotal = useSelector(selectCartTotal);

  useEffect(() => { if (token) dispatch(fetchCart()); }, [token]);

  const handleUpdate = async (itemId, quantity) => {
    try { await dispatch(updateCartItem({ itemId, quantity })).unwrap(); }
    catch (err) { toast.error(err || 'Update failed'); }
  };

  const handleRemove = async (itemId) => {
    try { await dispatch(removeFromCart(itemId)).unwrap(); toast.success('Removed from cart'); }
    catch (err) { toast.error(err || 'Failed to remove'); }
  };

  if (!token) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
      <h2 className="text-2xl font-bold mb-3">Your cart awaits</h2>
      <p className="text-gray-500 mb-6">Please login to view and manage your cart.</p>
      <Link to="/login" className="btn-primary">Sign In</Link>
    </div>
  );

  if (loading && !cart) return <Spinner size="lg" className="py-40" />;

  const items = cart?.items || [];
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : subtotal > 0 ? 9.99 : 0;
  const total = subtotal + tax + shipping;

  if (!items.length) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
      <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
      <Link to="/products" className="btn-primary">Start Shopping</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 mb-8">Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card p-4 flex gap-4">
              <Link to={`/products/${item.product.slug || item.product.id}`} className="flex-shrink-0">
                <img src={item.product.images?.[0] || 'https://placehold.co/100x100'} alt={item.product.name} className="w-24 h-24 object-cover rounded-xl" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-primary-600 font-medium">{item.product.category?.name}</p>
                    <Link to={`/products/${item.product.slug || item.product.id}`} className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">{item.product.name}</Link>
                  </div>
                  <button onClick={() => handleRemove(item.id)} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1"><Trash2 size={16} /></button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => handleUpdate(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-50 transition-colors"><Minus size={14} /></button>
                    <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => handleUpdate(item.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock} className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-40"><Plus size={14} /></button>
                  </div>
                  <p className="font-bold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="card p-6 sticky top-20">
            <h2 className="font-bold text-lg mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tax (8%)</span><span className="font-medium">${tax.toFixed(2)}</span></div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {subtotal < 100 && subtotal > 0 && <p className="text-xs text-primary-600 bg-primary-50 px-3 py-2 rounded-lg">Add ${(100 - subtotal).toFixed(2)} more for free shipping!</p>}
              <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="w-full btn-primary flex items-center justify-center gap-2 py-3.5">
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            <Link to="/products" className="block text-center text-sm text-primary-600 mt-3 hover:underline">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
