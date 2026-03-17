import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { register, clearError } from '../store/authSlice';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const { loading, error, token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => { if (token) navigate('/'); return () => dispatch(clearError()); }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { return; }
    dispatch(register({ name: form.name, email: form.email, password: form.password }));
  };

  const perks = ['Free shipping on orders $100+', 'Exclusive member deals', 'Track your orders easily', 'Easy returns & refunds'];

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-dark to-gray-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="relative text-white max-w-sm">
          <div className="bg-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6"><ShoppingBag size={32} /></div>
          <h1 className="font-display font-bold text-4xl mb-4">Join ShopNow</h1>
          <p className="text-gray-300 mb-8">Create an account and unlock exclusive benefits.</p>
          <div className="space-y-3">
            {perks.map((p) => <div key={p} className="flex items-center gap-3 text-gray-300"><CheckCircle size={16} className="text-primary-400" /><span>{p}</span></div>)}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-500 mb-8">Already have one? <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link></p>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="John Doe" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email Address</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required minLength={6} value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder="Min 6 characters" className="input-field pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><EyeOff size={16} /></button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
              <input type="password" required value={form.confirm} onChange={(e) => setForm({...form, confirm: e.target.value})} placeholder="Repeat password" className={`input-field ${form.confirm && form.confirm !== form.password ? 'border-red-300 focus:ring-red-500' : ''}`} />
              {form.confirm && form.confirm !== form.password && <p className="text-red-500 text-xs mt-1">Passwords do not match</p>}
            </div>
            <button type="submit" disabled={loading || (form.confirm && form.confirm !== form.password)} className="w-full btn-primary py-3.5 text-base">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
