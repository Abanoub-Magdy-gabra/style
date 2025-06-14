import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch orders from local storage or mock data
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have any orders in localStorage
        const storedOrders = localStorage.getItem('orders');
        let ordersData: Order[] = [];
        
        if (storedOrders) {
          ordersData = JSON.parse(storedOrders);
        } else {
          // If no orders in localStorage, use mock data
          ordersData = generateMockOrders();
          // Save mock orders to localStorage for persistence
          localStorage.setItem('orders', JSON.stringify(ordersData));
        }
        
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Generate mock orders for demo purposes
  const generateMockOrders = (): Order[] => {
    const mockOrders: Order[] = [
      {
        id: 'order_' + Math.random().toString(36).substring(2, 11),
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        status: 'processing',
        total: 4500, // In EGP
        items: [
          {
            id: 'product_1',
            name: 'Premium Cotton T-Shirt',
            price: 1500,
            quantity: 2,
            image: '/images/products/tshirt.jpg'
          },
          {
            id: 'product_2',
            name: 'Slim Fit Jeans',
            price: 1500,
            quantity: 1,
            image: '/images/products/jeans.jpg'
          }
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          city: 'Cairo',
          state: 'Cairo',
          postalCode: '12345',
          country: 'Egypt'
        },
        paymentMethod: 'card',
        paymentId: 'pay_' + Math.random().toString(36).substring(2, 11),
        estimatedDelivery: formatDeliveryDate(5)
      },
      {
        id: 'order_' + Math.random().toString(36).substring(2, 11),
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        status: 'delivered',
        total: 3000, // In EGP
        items: [
          {
            id: 'product_3',
            name: 'Casual Shirt',
            price: 1800,
            quantity: 1,
            image: '/images/products/shirt.jpg'
          },
          {
            id: 'product_4',
            name: 'Leather Belt',
            price: 1200,
            quantity: 1,
            image: '/images/products/belt.jpg'
          }
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          city: 'Cairo',
          state: 'Cairo',
          postalCode: '12345',
          country: 'Egypt'
        },
        paymentMethod: 'card',
        paymentId: 'pay_' + Math.random().toString(36).substring(2, 11),
        estimatedDelivery: formatDeliveryDate(-10) // Already delivered
      }
    ];
    
    return mockOrders;
  };

  // Format delivery date helper
  function formatDeliveryDate(daysFromNow: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  }

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
          <p className="text-neutral-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <ShoppingBagIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No orders yet</h3>
            <p className="text-neutral-600 mb-6">You haven't placed any orders yet.</p>
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-neutral-200">
              {orders.map((order) => (
                <li key={order.id}>
                  <Link 
                    to={`/orders/${order.id}`} 
                    className="block hover:bg-neutral-50 transition-colors"
                  >
                    <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-4 sm:mb-0">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-neutral-900">Order #{order.id.split('_')[1]}</h3>
                          <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-500">
                          Placed on {formatDate(order.date)}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • {formatCurrency(order.total)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex -space-x-2 overflow-hidden mr-4">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div 
                              key={index} 
                              className="h-10 w-10 rounded-full border-2 border-white overflow-hidden bg-neutral-100 flex items-center justify-center"
                            >
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <ShoppingBagIcon className="h-5 w-5 text-neutral-400" />
                              )}
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="h-10 w-10 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center text-xs font-medium text-neutral-500">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <ChevronRightIcon className="h-5 w-5 text-neutral-400" />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
