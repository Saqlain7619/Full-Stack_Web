import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import api from '../api/axios';
import { selectCartTotal } from '../store/cartSlice';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/formatPrice';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { cart } = useSelector((s) => s.cart);
  const subtotal = useSelector(selectCartTotal);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name || '', email: user?.email || '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'PK',
    paymentMethod: 'COD',
  });

  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping;
  const items = cart?.items || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        shippingAddress: { fullName: form.fullName, email: form.email, phone: form.phone, address: form.address, city: form.city, state: form.state, zip: form.zip, country: form.country },
        paymentMethod: form.paymentMethod,
      });

      if (form.paymentMethod === 'JAZZCASH') {
        const payRes = await api.post('/payments/initiate', { orderId: data.order.id });
        const { gatewayUrl, payload } = payRes.data;

        toast.loading('Redirecting to JazzCash...', { duration: 3000 });
        
        // Dynamically create a hidden form and submit it to Gateway URL
        const formEl = document.createElement('form');
        formEl.method = 'POST';
        formEl.action = gatewayUrl;
        
        Object.keys(payload).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = payload[key];
          formEl.appendChild(input);
        });
        
        document.body.appendChild(formEl);
        formEl.submit(); // Browser will redirect natively
        return; 
      }

      toast.success('Order placed successfully!');
      navigate(`/orders/${data.order.id}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to place order'); setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display font-bold text-2xl sm:text-3xl mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-8">
        {/* Left: Details */}
        <div className="lg:col-span-3 space-y-6">
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Truck size={18} className="text-primary-600" />Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">Full Name</label><input required value={form.fullName} onChange={(e) => setForm({...form, fullName: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium mb-1">Phone</label><input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="input-field" /></div>
              <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">Address</label><input required value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium mb-1">City</label><input required value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium mb-1">State</label><input required value={form.state} onChange={(e) => setForm({...form, state: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium mb-1">ZIP Code</label><input required value={form.zip} onChange={(e) => setForm({...form, zip: e.target.value})} className="input-field" /></div>
              <div><label className="block text-sm font-medium mb-1">Country</label>
                <select value={form.country} onChange={(e) => setForm({...form, country: e.target.value})} className="input-field">
                  <option value="PK">Pakistan</option><option value="US">United States</option><option value="UK">United Kingdom</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><CreditCard size={18} className="text-primary-600" />Payment Method</h2>
            <div className="space-y-3">
              {[
                ['COD', 'Cash on Delivery', 'Pay when your order arrives'], 
                ['JAZZCASH', 'JazzCash', 'Pay securely via Mobile Wallet or Card'], 
                ['CARD', 'Credit/Debit Card', 'Coming soon']
              ].map(([val, label, desc]) => {
                const isDisabled = val === 'CARD';
                return (
                  <label key={val} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${form.paymentMethod === val ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input type="radio" name="payment" value={val} checked={form.paymentMethod === val} onChange={(e) => !isDisabled && setForm({...form, paymentMethod: e.target.value})} disabled={isDisabled} className="text-primary-600" />
                    <div><p className="font-semibold text-sm">{label}</p><p className="text-xs text-gray-500">{desc}</p></div>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-20">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.product.images?.[0] || 'https://placehold.co/50x50'} alt="" className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} {item.size && `| Size: ${item.size}`}</p>
                  </div>
                  <p className="text-sm font-bold">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tax (8%)</span><span>{formatPrice(tax)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
            <button type="submit" disabled={loading || !items.length} className="w-full btn-primary mt-6 py-3.5 flex items-center justify-center gap-2">
              {loading ? 'Placing Order...' : <><CheckCircle size={18} />Place Order</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
