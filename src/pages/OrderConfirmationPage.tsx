import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CheckCircleIcon, ShoppingBagIcon, TruckIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type OrderDetails = {
  orderId: string;
  paymentId: string;
  amount: number;
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
  status: string;
  estimatedDelivery?: string;
  shippingMethod?: string;
};

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state as OrderDetails | undefined;
  const paymentMethod = location.state?.paymentMethod || 'Credit Card';
  const paymentId = location.state?.paymentId || 'N/A';
  const status = location.state?.status || 'succeeded';
  const lastFour = location.state?.lastFour || '';
  const cardType = location.state?.cardType || 'Card';

  // If no order details in location state, redirect to home
  useEffect(() => {
    if (!orderDetails) {
      navigate('/');
    }
  }, [orderDetails, navigate]);

  if (!orderDetails) {
    return null;
  }

  const { items, shippingAddress, estimatedDelivery } = orderDetails;
  
  // Calculate order summary
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = orderDetails.shippingMethod === 'free' ? 0 : 7.99;
  const total = subtotal + tax + shipping;

  // Format delivery date (3-5 business days from now)
  const formatDeliveryDate = () => {
    if (estimatedDelivery) return estimatedDelivery;
    
    const date = new Date();
    // Add 3-5 business days
    let daysToAdd = 3 + Math.floor(Math.random() * 3);
    while (daysToAdd > 0) {
      date.setDate(date.getDate() + 1);
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        daysToAdd--;
      }
    }
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-primary-50">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-neutral-900">
                Thank you for your order!
              </h1>
              <div className="mt-2">
                <p className="text-sm text-neutral-600">
                  {cardType} ending in ••••{lastFour || paymentId.slice(-4)}
                </p>
                <p className="text-sm text-neutral-600">
                  {status === 'succeeded' ? 'Paid' : 'Pending'}
                </p>
              </div>
            </div>
            <p className="mt-1 text-sm text-neutral-600">
              Order #{orderId} has been placed and is being processed.
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              We've sent a confirmation email with order details and tracking information.
            </p>
          </div>
          
          <div className="border-t border-neutral-200 px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between">
              <div className="mb-6 sm:mb-0">
                <h2 className="text-lg font-medium text-neutral-900 mb-3">Order Information</h2>
                <div className="space-y-1 text-sm text-neutral-700">
                  <p><span className="font-medium">Order Number:</span> {orderId}</p>
                  <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
                  <p><span className="font-medium">Payment Method:</span> {paymentMethod}</p>
                  <p><span className="font-medium">Payment ID:</span> {paymentId}</p>
                </div>
              </div>
              
              <div className="bg-neutral-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-neutral-900 mb-2">Shipping Address</h3>
                <div className="text-sm text-neutral-700">
                  <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                  <p>{shippingAddress.address1}</p>
                  {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
                  <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                  <p>{shippingAddress.country}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-lg font-medium text-neutral-900 mb-4">Order Summary</h2>
              <div className="overflow-hidden border border-neutral-200 rounded-md">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-neutral-100 rounded-md flex items-center justify-center">
                              <ShoppingBagIcon className="h-6 w-6 text-neutral-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-neutral-900">{item.name}</div>
                              <div className="text-sm text-neutral-500">SKU: {item.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 text-right">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 text-center">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 text-right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-neutral-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-neutral-700">
                        Subtotal
                      </td>
                      <td className="px-6 py-3 text-right text-sm font-medium text-neutral-900">
                        ${subtotal.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-6 py-1 text-right text-sm font-medium text-neutral-700">
                        Shipping
                      </td>
                      <td className="px-6 py-1 text-right text-sm font-medium text-neutral-900">
                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-6 py-1 text-right text-sm font-medium text-neutral-700">
                        Tax
                      </td>
                      <td className="px-6 py-1 text-right text-sm font-medium text-neutral-900">
                        ${tax.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="border-t border-neutral-200">
                      <td colSpan={3} className="px-6 py-3 text-right text-base font-bold text-neutral-900">
                        Total
                      </td>
                      <td className="px-6 py-3 text-right text-base font-bold text-neutral-900">
                        ${total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-neutral-200">
              <h2 className="text-lg font-medium text-neutral-900 mb-4">What's Next?</h2>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <TruckIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Order Status</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>Your order is being processed and will be shipped soon.</p>
                      <p className="mt-1">
                        Estimated delivery: <span className="font-medium">{formatDeliveryDate()}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/products"
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/orders"
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-neutral-300 rounded-md shadow-sm text-base font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  View Order History
                </Link>
              </div>
            </div>
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
