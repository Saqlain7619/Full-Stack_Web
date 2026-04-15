import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, LogOut, Menu, X, ShoppingBag, ExternalLink } from 'lucide-react';
import { logout } from '../../store/authSlice';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/categories', label: 'Categories', icon: Tag },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };
  const isActive = (path, exact) => exact ? location.pathname === path : location.pathname.startsWith(path);

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-dark">
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-white p-2 rounded-xl">
            <img 
              src="/logo-icon.png" 
              alt="Fash Fit Icon" 
              className="h-8 w-auto object-contain transition-transform duration-500 group-hover:scale-110" 
            />
          </div>
          <div className="flex flex-col items-start leading-none pt-0.5">
            <span className="font-display font-bold text-lg text-white tracking-tight group-hover:text-primary-600 transition-colors uppercase">
              FASH FIT
            </span>
            <span className="text-[7.5px] uppercase tracking-[0.4em] font-bold text-primary-600 mt-0.5 opacity-80">
              Styling
            </span>
          </div>
        </Link>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400"><X size={18} /></button>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ path, label, icon: Icon, exact }) => (
          <Link key={path} to={path} onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(path, exact) ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}>
            <Icon size={17} />{label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">{user?.name?.[0]}</div>
          <div className="min-w-0"><p className="text-white text-sm font-medium truncate">{user?.name}</p><p className="text-gray-500 text-xs">Administrator</p></div>
        </div>
        <Link to="/" className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 text-sm transition-colors mb-1">
          <ExternalLink size={15} />View Store
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-white/10 text-sm transition-colors w-full">
          <LogOut size={15} />Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 flex-col flex-shrink-0"><Sidebar /></div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex-col flex"><Sidebar /></div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100"><Menu size={20} /></button>
          <h1 className="font-display font-bold text-gray-900">Admin Panel</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
