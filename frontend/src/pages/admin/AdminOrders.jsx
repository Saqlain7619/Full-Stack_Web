import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ChevronDown } from 'lucide-react';
import api from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const statusColors = { PENDING:'bg-yellow-100 text-yellow-700', CONFIRMED:'bg-blue-100 text-blue-700', PROCESSING:'bg-purple-100 text-purple-700', SHIPPED:'bg-indigo-100 text-indigo-700', DELIVERED:'bg-green-100 text-green-700', CANCELLED:'bg-red-100 text-red-700', REFUNDED:'bg-gray-100 text-gray-600' };
const statusOptions = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (filter) params.status = filter;
      const { data } = await api.get('/orders', { params });
      setOrders(data.orders); setTotal(data.total);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, filter]);

  const updateStatus = async (orderId, status) => {
    try { await api.put(`/orders/${orderId}/status`, { status }); toast.success('Status updated'); load(); }
    catch { toast.error('Failed to update'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm">{total} total orders</p>
        </div>
        <div className="relative">
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }} className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
            <option value="">All Statuses</option>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="card">
        {loading ? <Spinner className="py-12" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>{['Order #', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-xs text-gray-700">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.user?.name}</p>
                      <p className="text-xs text-gray-500">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.items?.length}</td>
                    <td className="px-4 py-3 font-bold">${order.total?.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} className={`appearance-none text-xs font-semibold px-2.5 py-1.5 rounded-lg border-0 cursor-pointer ${statusColors[order.status]} pr-6`}>
                          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={10} className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <Link to={`/orders/${order.id}`} className="p-1.5 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors inline-block"><Eye size={14} /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!orders.length && <div className="text-center py-12 text-gray-500"><p>No orders found</p></div>}
          </div>
        )}
        {Math.ceil(total/15) > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-center gap-2">
            {Array.from({ length: Math.ceil(total/15) }, (_, i) => <button key={i} onClick={() => setPage(i+1)} className={`w-8 h-8 rounded-lg text-sm font-medium ${page === i+1 ? 'bg-primary-600 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>{i+1}</button>)}
          </div>
        )}
      </div>
    </div>
  );
}
