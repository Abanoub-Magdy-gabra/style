import { Link } from 'react-router-dom';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/currencyUtils';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingMethod: string;
  shippingAddress: {
    firstName?: string;
    lastName?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    email?: string;
    phone?: string;
  };
}

export default function OrderSummary({ 
  items, 
  subtotal, 
  shippingCost, 
  tax, 
  total,
  shippingMethod,
  shippingAddress 
}: OrderSummaryProps) {
  const shippingMethodLabel = {
    standard: 'Standard Shipping',
    express: 'Express Shipping',
    'free-shipping': 'Free Shipping'
  }[shippingMethod] || 'Standard Shipping';

  const shippingCostDisplay = shippingCost === 0 ? 'Free' : formatCurrency(shippingCost);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-neutral-200">
        <h3 className="text-lg font-medium leading-6 text-neutral-900">Order Summary</h3>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <div className="flow-root">
          <ul className="divide-y divide-neutral-200">
            {items.map((item) => (
              <li key={item.id} className="py-4 flex">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="h-full w-full bg-neutral-100 flex items-center justify-center">
                      <ShoppingBagIcon className="h-8 w-8 text-neutral-400" />
                    </div>
                  )}
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-neutral-900">
                      <h3>
                        <Link to={`/products/${item.id}`} className="hover:text-primary-600">
                          {item.name}
                        </Link>
                      </h3>
                      <p className="ml-4">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex-1 flex items-end justify-between text-sm">
                    <p className="text-neutral-500">{formatCurrency(item.price)} each</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 border-t border-neutral-200 pt-6">
          <h4 className="text-sm font-medium text-neutral-900 mb-4">Shipping Address</h4>
          <div className="text-sm text-neutral-700 space-y-1">
            <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
            <p>{shippingAddress.address1}</p>
            {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
            <p>
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
            </p>
            <p>{shippingAddress.country}</p>
            {shippingAddress.email && (
              <p className="mt-2 text-primary-600">{shippingAddress.email}</p>
            )}
            {shippingAddress.phone && (
              <p className="text-primary-600">{shippingAddress.phone}</p>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-neutral-200 pt-6">
          <h4 className="text-sm font-medium text-neutral-900 mb-4">Shipping Method</h4>
          <div className="flex justify-between text-sm text-neutral-700">
            <p>{shippingMethodLabel}</p>
            <p>{shippingCostDisplay}</p>
          </div>
        </div>

        <div className="mt-6 border-t border-neutral-200 pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-neutral-600">
              <p>Subtotal</p>
              <p>{formatCurrency(subtotal)}</p>
            </div>
            <div className="flex justify-between text-sm text-neutral-600">
              <p>Shipping</p>
              <p>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</p>
            </div>
            <div className="flex justify-between text-sm text-neutral-600">
              <p>Tax</p>
              <p>{formatCurrency(tax)}</p>
            </div>
            <div className="flex justify-between pt-3 border-t border-neutral-200 text-base font-medium text-neutral-900">
              <p>Total</p>
              <p>{formatCurrency(total)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
