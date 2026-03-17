import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingCart, Package, DollarSign, TrendingUp, Eye } from 'lucide-react';
import api from '../../api/axios';
import Spinner from '../../components/common/Spinner';

const statusColors = { PENDING:'bg-yellow-100 text-yellow-700', CONFIRMED:'bg-blue-100 text-blue-700', PROCESSING:'bg-purple-100 text-purple-700', SHIPPED:'bg-indigo-100 text-indigo-700', DELIVERED:'bg-green-100 text-green-700', CANCELLED:'bg-red-100 text-red-700' };

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data.stats)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner size="lg" className="py-20" />;

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'bg-blue-500', change: '+12%' },
    { label: 'Total Orders', value: stats?.totalOrders, icon: ShoppingCart, color: 'bg-primary-600', change: '+8%' },
    { label: 'Products', value: stats?.totalProducts, icon: Package, color: 'bg-purple-500', change: '+3%' },
    { label: 'Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, icon: DollarSign, color: 'bg-green-500', change: '+15%' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, here's what's happening.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <TrendingUp size={14} className="text-green-500" />
          <span>All time stats</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {cards.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`${color} p-2.5 rounded-xl`}><Icon size={18} className="text-white" /></div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">{change}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-primary-600 text-sm font-medium hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats?.recentOrders?.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm text-gray-900">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{order.user?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                  <span className="font-bold text-sm">${order.total?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="card">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Top Products</h2>
            <Link to="/admin/products" className="text-primary-600 text-sm font-medium hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats?.topProducts?.map((product, i) => (
              <div key={i} className="p-4 flex items-center gap-3">
                <img src={product.images?.[0] || 'https://placehold.co/40x40'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sold} sold</p>
                </div>
                <span className="font-bold text-sm">${product.price?.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
