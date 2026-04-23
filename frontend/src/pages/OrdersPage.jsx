import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import api from '../api/axios';
import Spinner from '../components/common/Spinner';
import { formatPrice } from '../utils/formatPrice';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders').then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner size="lg" className="py-40" />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display font-bold text-2xl sm:text-3xl mb-8">My Orders</h1>

      {!orders.length ? (
        <div className="text-center py-24">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
          <h3 className="text-xl font-bold mb-3">No orders yet</h3>
          <p className="text-gray-500 mb-6">When you place your first order, it will appear here.</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className="card p-5 block hover:shadow-md transition-all group">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Package size={16} className="text-primary-600" />
                    <span className="font-bold text-gray-900">{order.orderNumber}</span>
                  </div>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-primary-600 transition-colors" />
                </div>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 3).map((item, i) => (
                    <img key={i} src={item.product?.images?.[0] || 'https://placehold.co/40x40'} alt="" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                  ))}
                  {order.items.length > 3 && <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">+{order.items.length - 3}</div>}
                </div>
                <span className="text-sm text-gray-600">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Total</span>
                <span className="font-bold text-lg">{formatPrice(order.total)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
