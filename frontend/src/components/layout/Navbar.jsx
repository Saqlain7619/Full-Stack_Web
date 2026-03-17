import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, ShoppingCart, User, Menu, X, Search, LogOut, Package, ChevronDown, LayoutDashboard } from 'lucide-react';
import { logout } from '../../store/authSlice';
import { selectCartCount } from '../../store/cartSlice';
import { fetchCart } from '../../store/cartSlice';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState('');
  const { user, token } = useSelector((s) => s.auth);
  const cartCount = useSelector(selectCartCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { if (token) dispatch(fetchCart()); }, [token]);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);
  useEffect(() => { setMenuOpen(false); setUserOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/products?search=${encodeURIComponent(search.trim())}`); setSearch(''); }
  };

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm border-b border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-primary-600 p-1.5 rounded-lg"><ShoppingBag className="text-white" size={18} /></div>
            <span className="font-display font-bold text-lg text-gray-900">ShopNow</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50" />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600"><Search size={16} /></button>
            </div>
          </form>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Products</Link>
            <Link to="/products?featured=true" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Featured</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <Link to="/cart" className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ShoppingCart size={20} className="text-gray-700" />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{cartCount > 9 ? '9+' : cartCount}</span>}
            </Link>

            {token ? (
              <div className="relative">
                <button onClick={() => setUserOpen(!userOpen)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-700">{user?.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <ChevronDown size={14} className="text-gray-500 hidden sm:block" />
                </button>
                {userOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-sm text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"><User size={15} />Profile</Link>
                    <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"><Package size={15} />My Orders</Link>
                    {user?.role === 'ADMIN' && <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-primary-600"><LayoutDashboard size={15} />Admin Panel</Link>}
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors w-full text-left text-red-500"><LogOut size={15} />Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex btn-primary py-2 px-4 text-sm">Sign In</Link>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50" />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><Search size={16} /></button>
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 space-y-1">
            <Link to="/products" className="block px-4 py-2.5 text-sm font-medium hover:bg-gray-50 rounded-xl">Products</Link>
            <Link to="/products?featured=true" className="block px-4 py-2.5 text-sm font-medium hover:bg-gray-50 rounded-xl">Featured</Link>
            {!token && <Link to="/login" className="block px-4 py-2.5 text-sm font-medium text-primary-600">Sign In</Link>}
          </div>
        )}
      </div>
    </header>
  );
}
