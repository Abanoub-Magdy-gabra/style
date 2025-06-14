import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBagIcon, TruckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../utils/currencyUtils';

// Define the Order type
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: {
    firstName?: string;
    lastName?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  paymentMethod: string;
  paymentId: string;
  estimatedDelivery?: string;
}

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // In a real app, this would be an API call
        // For now, we'll get the order from localStorage
        const storedOrders = localStorage.getItem('orders');
        
        if (storedOrders) {
          const orders: Order[] = JSON.parse(storedOrders);
          const foundOrder = orders.find(order => order.id === orderId);
          
          if (foundOrder) {
            setOrder(foundOrder);
          } else {
            setError('Order not found');
          }
        } else {
          setError('No orders found');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get status badge color
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status display text
  const getStatusText = (status: Order['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <ShoppingBagIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Order not found</h3>
            <p className="text-neutral-600 mb-6">{error || 'The requested order could not be found.'}</p>
            <Link
              to="/orders"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate order summary
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.14; // 14% Egyptian VAT
  const shipping = order.status === 'cancelled' ? 0 : (order.total - subtotal - tax);

  return (
    <div className="bg-neutral-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/orders')}
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Orders
          </button>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-neutral-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  Order #{order.id.split('_')[1]}
                </h1>
                <p className="mt-1 text-sm text-neutral-500">
                  Placed on {formatDate(order.date)}
                </p>
              </div>
              <div className="mt-3 sm:mt-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-neutral-900 mb-3">Shipping Information</h2>
                <div className="text-sm text-neutral-700 space-y-1">
                  <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.shippingAddress.address1}</p>
                  {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
                
                {order.status !== 'cancelled' && order.estimatedDelivery && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-neutral-900 mb-2">Delivery Information</h3>
                    <div className="bg-blue-50 rounded-lg p-3 flex">
                      <TruckIcon className="h-5 w-5 text-blue-400 mr-2" />
                      <div>
                        <p className="text-sm text-blue-700">
                          {order.status === 'delivered' ? 'Delivered on' : 'Estimated delivery'}:
                        </p>
                        <p className="text-sm font-medium text-blue-800">
                          {order.estimatedDelivery}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="text-lg font-medium text-neutral-900 mb-3">Payment Information</h2>
                <div className="text-sm text-neutral-700 space-y-1">
                  <p>
                    <span className="font-medium">Payment Method:</span> {order.paymentMethod === 'card' ? 'Credit Card' : order.paymentMethod}
                  </p>
                  <p>
                    <span className="font-medium">Payment ID:</span> {order.paymentId}
                  </p>
                  <p>
                    <span className="font-medium">Payment Status:</span> {order.status === 'cancelled' ? 'Refunded' : 'Paid'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-lg font-medium text-neutral-900 mb-4">Order Items</h2>
              <div className="overflow-hidden border border-neutral-200 rounded-lg">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover object-center"
                                />
                              ) : (
                                <div className="h-full w-full bg-neutral-100 flex items-center justify-center">
                                  <ShoppingBagIcon className="h-5 w-5 text-neutral-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-neutral-900">{item.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-neutral-500">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-neutral-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-neutral-900">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="px-6 py-1 text-right text-sm font-medium text-neutral-700">
                        Subtotal
                      </td>
                      <td className="px-6 py-1 text-right text-sm font-medium text-neutral-900">
                        {formatCurrency(subtotal)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-6 py-1 text-right text-sm font-medium text-neutral-700">
                        Shipping
                      </td>
                      <td className="px-6 py-1 text-right text-sm font-medium text-neutral-900">
                        {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-6 py-1 text-right text-sm font-medium text-neutral-700">
                        Tax
                      </td>
                      <td className="px-6 py-1 text-right text-sm font-medium text-neutral-900">
                        {formatCurrency(tax)}
                      </td>
                    </tr>
                    <tr className="border-t border-neutral-200">
                      <td colSpan={3} className="px-6 py-3 text-right text-base font-bold text-neutral-900">
                        Total
                      </td>
                      <td className="px-6 py-3 text-right text-base font-bold text-neutral-900">
                        {formatCurrency(order.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            {order.status !== 'cancelled' && (
              <div className="mt-8 flex justify-end">
                <Link
                  to={`/products`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Buy Again
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-neutral-900">Need Help?</h3>
          </div>
          <div className="border-t border-neutral-200 px-4 py-5 sm:p-6">
            <p className="text-sm text-neutral-700 mb-4">
              If you have any questions about your order, please don't hesitate to contact our customer service team.
            </p>
            <div className="space-y-3">
              <a href="mailto:support@stylesphere.com" className="block text-sm font-medium text-primary-600 hover:text-primary-500">
                support@stylesphere.com
              </a>
              <a href="tel:+18005551234" className="block text-sm font-medium text-primary-600 hover:text-primary-500">
                (800) 555-1234
              </a>
              <p className="text-sm text-neutral-500 mt-2">
                Our customer service team is available Monday to Friday, 9:00 AM to 5:00 PM EST.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
