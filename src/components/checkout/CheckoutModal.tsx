import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { CartItem } from '../../types/cart';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const navigate = useNavigate();
  const { cartItems = [] } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleProceedToCheckout = () => {
    setIsLoading(true);
    // In a real app, you might want to validate the cart or perform other checks here
    navigate('/checkout');
  };

  if (!isOpen) return null;

  // Define order summary type
  interface OrderSummary {
    itemCount: number;
    subtotal: number;
  }

  // Calculate order summary with explicit type and safe number handling
  const orderSummary: OrderSummary = cartItems.reduce<OrderSummary>(
    (acc: OrderSummary, item: CartItem) => {
      try {
        const quantity: number = typeof item.quantity === 'number' ? item.quantity : 0;
        const price: number = typeof item.price === 'number' ? item.price : 0;
        const itemTotal: number = price * quantity;
        const newSubtotal: number = acc.subtotal + itemTotal;
        
        return {
          itemCount: acc.itemCount + quantity,
          subtotal: parseFloat(newSubtotal.toFixed(2))
        };
      } catch (error) {
        console.error('Error calculating order summary:', error);
        return acc; // Return accumulator unchanged in case of error
      }
    }, 
    { itemCount: 0, subtotal: 0 }
  );

  // Calculate order totals with safe number handling
  const shippingCost = 0; // Free shipping for now
  const tax = parseFloat((orderSummary.subtotal * 0.1).toFixed(2)); // 10% tax
  const total = parseFloat((orderSummary.subtotal + shippingCost + tax).toFixed(2));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal content */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Review Your Order
                </h3>
                
                {/* Order Summary */}
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-900">Order Summary</h4>
                  <div className="mt-2 max-h-60 overflow-y-auto">
                    {cartItems.length === 0 ? (
                      <p className="text-sm text-gray-500">Your cart is empty</p>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {cartItems.map((item) => (
                          <li key={item.id} className="flex items-center py-2">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              {item.images?.[0] && (
                                <img
                                  src={item.images[0]}
                                  alt={item.name}
                                  className="h-full w-full object-cover object-center"
                                />
                              )}
                            </div>
                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </h4>
                                <p className="mt-1 text-sm text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                ${((Number(item.price) || 0) * (Number(item.quantity) || 0)).toFixed(2)}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Order Total */}
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal ({orderSummary.itemCount} items)</p>
                    <p>${orderSummary.subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <p>Shipping</p>
                    <p>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <p>Tax</p>
                    <p>${tax.toFixed(2)}</p>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-base font-medium text-gray-900">
                    <p>Total</p>
                    <p>${total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer with action buttons */}
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={handleProceedToCheckout}
              disabled={cartItems.length === 0 || isLoading}
              className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm sm:ml-3 sm:w-auto sm:text-sm ${
                cartItems.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
