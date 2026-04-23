import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, ShoppingCart, User, Menu, X, Search, LogOut, Package, ChevronDown, LayoutDashboard } from 'lucide-react';
import { logout } from '../../store/authSlice';
import { selectCartCount, fetchCart } from '../../store/cartSlice';

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
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-premium border-b border-black/5 py-1' : 'bg-white border-b border-black/5 py-2'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Main row ── */}
        <div className="flex items-center justify-between h-16 gap-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0 py-1">
            <div className="relative">
              <img 
                src="/logo-icon.png" 
                alt="Fash Fit Icon" 
                className="h-10 sm:h-11 w-auto object-contain transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-primary-600/5 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 -z-10" />
            </div>
            <div className="flex flex-col items-start leading-none pb-0.5">
              <span className="font-display font-bold text-xl sm:text-2xl text-black tracking-tight group-hover:text-primary-600 transition-colors">
                FASH FIT
              </span>
              <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-primary-600 mt-0.5 opacity-80">
                Styling
              </span>
            </div>
          </Link>

          {/* Navigation — desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {['Catalog', 'Featured', 'About Us', 'Contact'].map((item) => (
              <Link
                key={item}
                to={item === 'Catalog' ? '/catalog' : item === 'Featured' ? '/catalog?featured=true' : item === 'About Us' ? '/about' : '/contact'}
                className="relative text-[13px] uppercase tracking-widest font-semibold text-black/70 hover:text-black transition-colors after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-primary-600 after:transition-all hover:after:w-full"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4 ml-auto">

            {/* Search icon (desktop) */}
            <form onSubmit={handleSearch} className="hidden md:flex relative group">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search collection..."
                className="w-48 pl-4 pr-10 py-2 border-b border-black/10 text-xs focus:outline-none focus:border-primary-600 bg-transparent transition-all group-hover:w-64"
              />
              <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-black/40 hover:text-primary-600 pt-1">
                <Search size={16} />
              </button>
            </form>

            <div className="flex items-center gap-1 sm:gap-3">
              {/* Cart */}
              <Link to="/cart" className="relative p-2.5 rounded-full hover:bg-black/5 transition-colors group">
                <ShoppingBag size={20} className="text-black group-hover:text-primary-600 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-primary-600 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User menu */}
              {token ? (
                <div className="relative">
                  <button
                    onClick={() => setUserOpen(!userOpen)}
                    className="flex items-center gap-2 p-1 rounded-full border border-black/5 hover:border-black/20 transition-all"
                  >
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                  </button>

                  {userOpen && (
                    <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-xl shadow-premium border border-black/5 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="px-5 py-3 border-b border-black/5 mb-2">
                        <p className="font-display font-semibold text-sm text-black truncate">{user?.name}</p>
                        <p className="text-[10px] uppercase tracking-wider text-black/40 truncate">{user?.email}</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-3 px-5 py-2.5 text-xs font-semibold hover:bg-black/5 transition-colors">
                        <User size={14} /> PROFILE
                      </Link>
                      <Link to="/orders" className="flex items-center gap-3 px-5 py-2.5 text-xs font-semibold hover:bg-black/5 transition-colors">
                        <Package size={14} /> MY ORDERS
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <Link to="/admin" className="flex items-center gap-3 px-5 py-2.5 text-xs font-semibold hover:bg-black/5 transition-colors text-primary-600">
                          <LayoutDashboard size={14} /> ADMIN PANEL
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-5 py-3 text-xs font-semibold hover:bg-red-50 transition-colors w-full text-left text-red-600 mt-2 border-t border-black/5 pt-4"
                      >
                        <LogOut size={14} /> LOGOUT
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="hidden sm:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-black hover:text-primary-600 transition-colors border-b-2 border-transparent hover:border-primary-600 pb-0.5">
                  Sign In
                </Link>
              )}

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-black/5"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {menuOpen && (
          <div className="lg:hidden py-8 px-6 space-y-10 border-t border-black/5 animate-in fade-in slide-in-from-top-4 duration-500 overflow-y-auto max-h-[calc(100vh-80px)]">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mt-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search collection..."
                className="w-full pl-5 pr-12 py-4 bg-luxury-gray border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20"
              />
              <button type="submit" className="absolute right-5 top-1/2 -translate-y-1/2 text-black/40">
                <Search size={20} />
              </button>
            </form>

            <div className="space-y-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">Explore</p>
              <div className="flex flex-col gap-5">
                {['Catalog', 'Featured', 'About Us', 'Contact'].map((item) => (
                  <Link
                    key={item}
                    to={item === 'Catalog' ? '/catalog' : item === 'Featured' ? '/catalog?featured=true' : item === 'About Us' ? '/about' : '/contact'}
                    className="text-2xl font-display font-medium text-black active:text-primary-600 transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-10 border-t border-black/10 space-y-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">Member Area</p>
              {token ? (
                <div className="grid grid-cols-1 gap-6">
                  <Link to="/profile" className="flex items-center gap-4 text-sm font-bold text-black uppercase tracking-[0.1em]">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    Profile Details
                  </Link>
                  <Link to="/orders" className="flex items-center gap-4 text-sm font-bold text-black uppercase tracking-[0.1em]">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-black">
                      <Package size={18} />
                    </div>
                    Order History
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 text-sm font-bold text-red-600 uppercase tracking-[0.1em] mt-4"
                  >
                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                      <LogOut size={18} />
                    </div>
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link to="/login" className="flex items-center justify-center w-full bg-black text-white py-4 rounded-2xl text-sm font-bold uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}