import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Eye, EyeOff } from 'lucide-react';
import { login, clearError } from '../store/authSlice';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { loading, error, token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => { if (token) navigate(from, { replace: true }); return () => dispatch(clearError()); }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-dark to-gray-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="relative text-center text-white">
          <div className="bg-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"><ShoppingBag size={32} /></div>
          <h1 className="font-display font-bold text-4xl mb-4">Welcome back!</h1>
          <p className="text-gray-300 text-lg">Sign in to continue shopping and track your orders.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="bg-primary-600 p-2 rounded-xl"><ShoppingBag className="text-white" size={20} /></div>
            <span className="font-display font-bold text-xl">ShopNow</span>
          </div>
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">Sign In</h2>
          <p className="text-gray-500 mb-8">Don't have an account? <Link to="/register" className="text-primary-600 font-medium hover:underline">Create one</Link></p>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email Address</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium">Password</label>
                <a href="#" className="text-xs text-primary-600 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder="••••••••" className="input-field pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 text-base">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-500">
            <p className="font-medium mb-1">Demo credentials:</p>
            <p>Admin: admin@store.com / admin123</p>
            <p>User: user@example.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
