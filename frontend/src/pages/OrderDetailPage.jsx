import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import api from '../api/axios';
import Spinner from '../components/common/Spinner';

const statusConfig = {
  PENDING: { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock, label: 'Order Pending' },
  CONFIRMED: { color: 'text-blue-600', bg: 'bg-blue-50', icon: CheckCircle, label: 'Confirmed' },
  PROCESSING: { color: 'text-purple-600', bg: 'bg-purple-50', icon: Package, label: 'Processing' },
  SHIPPED: { color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Truck, label: 'Shipped' },
  DELIVERED: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle, label: 'Delivered' },
  CANCELLED: { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle, label: 'Cancelled' },
};

const steps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner size="lg" className="py-40" />;
  if (!order) return <div className="text-center py-40"><h2 className="text-2xl font-bold">Order not found</h2></div>;

  const status = statusConfig[order.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;
  const currentStep = steps.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/orders" className="flex items-center gap-1 text-gray-500 hover:text-primary-600 text-sm mb-6"><ChevronLeft size={16} />Back to Orders</Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">{order.orderNumber}</h1>
          <p className="text-gray-500 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${status.bg} ${status.color} font-semibold text-sm`}>
          <StatusIcon size={16} />{status.label}
        </div>
      </div>

      {/* Progress */}
      {order.status !== 'CANCELLED' && (
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200 -z-0">
              <div className="h-full bg-primary-600 transition-all" style={{ width: `${Math.max(0, (currentStep / (steps.length - 1)) * 100)}%` }} />
            </div>
            {steps.map((step, i) => {
              const done = i <= currentStep;
              return (
                <div key={step} className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-all ${done ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                    {done && i < currentStep ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${done ? 'text-primary-600' : 'text-gray-400'}`}>{step.charAt(0) + step.slice(1).toLowerCase()}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="card p-6 mb-6">
            <h2 className="font-bold text-lg mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img src={item.product?.images?.[0] || 'https://placehold.co/80x80'} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.product?.name}</p>
                    <p className="text-gray-500 text-xs">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                  <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-4">Shipping Address</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
              <p>{order.shippingAddress?.country}</p>
              {order.shippingAddress?.phone && <p>{order.shippingAddress.phone}</p>}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-4">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tax</span><span>${order.tax.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-100">
                <span>Total</span><span>${order.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Payment</span><span className="font-medium">{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Status</span>
                <span className={`font-medium ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>{order.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
