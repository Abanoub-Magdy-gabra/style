import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import ShippingForm, { ShippingAddress } from '../components/checkout/ShippingForm';
import ShippingMethodSelector, { ShippingMethod } from '../components/checkout/ShippingMethodSelector';
import OrderSummary from '../components/checkout/OrderSummary';
import { ArrowLeft, Lock } from 'lucide-react';
import { formatCurrency, VAT_RATE } from '../utils/currencyUtils';

type CheckoutStep = 'shipping' | 'payment';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Calculate totals
  const subtotal = getTotalPrice();
  const shippingCost = shippingMethod?.price || 0;
  const tax = subtotal * VAT_RATE;
  const total = subtotal + shippingCost + tax;

  const handleShippingSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);
    if (shippingMethod) {
      proceedToPayment();
    }
  };

  const handleShippingMethodSelect = (method: ShippingMethod) => {
    setShippingMethod(method);
    if (shippingAddress) {
      proceedToPayment();
    }
  };

  const proceedToPayment = () => {
    if (shippingAddress && shippingMethod) {
      navigate('/checkout/confirmation', {
        state: {
          shippingAddress,
          shippingMethod: shippingMethod.id,
          cartItems,
          totals: {
            subtotal,
            shippingCost,
            tax,
            total,
          },
        },
      });
    }
  };

  if (cartItems.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-neutral-600 hover:text-primary-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-neutral-900">Checkout</h1>
            <div className="flex items-center text-sm text-neutral-500">
              <Lock className="w-4 h-4 mr-1" />
              Secure Checkout
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mt-6">
            <div className="flex items-center">
              <div className={`flex items-center ${currentStep === 'shipping' ? 'text-primary-600' : 'text-neutral-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 'shipping' ? 'bg-primary-600 text-white' : 'bg-neutral-200'
                }`}>
                  1
                </div>
                <span className="ml-2 font-medium">Shipping</span>
              </div>
              
              <div className="flex-1 h-px bg-neutral-200 mx-4"></div>
              
              <div className={`flex items-center ${currentStep === 'payment' ? 'text-primary-600' : 'text-neutral-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 'payment' ? 'bg-primary-600 text-white' : 'bg-neutral-200'
                }`}>
                  2
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Authentication Notice */}
            {!isAuthenticated && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-700">
                  <strong>Guest Checkout:</strong> You're checking out as a guest. 
                  <button
                    onClick={() => navigate('/login', { state: { from: { pathname: '/checkout' } } })}
                    className="ml-1 text-blue-600 hover:text-blue-800 underline"
                  >
                    Sign in
                  </button>
                  {' '}or{' '}
                  <button
                    onClick={() => navigate('/register', { state: { from: { pathname: '/checkout' } } })}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    create an account
                  </button>
                  {' '}to save your information for faster checkout.
                </p>
              </div>
            )}

            {/* Shipping Form */}
            <ShippingForm
              onSubmit={handleShippingSubmit}
              isLoading={isLoading}
            />

            {/* Shipping Method */}
            <ShippingMethodSelector
              onSelect={handleShippingMethodSelect}
              selectedMethod={shippingMethod || undefined}
            />

            {/* Continue Button */}
            {shippingAddress && shippingMethod && (
              <div className="flex justify-end">
                <button
                  onClick={proceedToPayment}
                  disabled={isLoading}
                  className="px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <OrderSummary
                items={cartItems.map(item => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  image: item.images?.[0],
                }))}
                subtotal={subtotal}
                shippingCost={shippingCost}
                tax={tax}
                total={total}
                shippingMethod={shippingMethod?.name || 'Not selected'}
                shippingAddress={shippingAddress || {}}
              />

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium text-green-800">Secure Checkout</h4>
                    <p className="text-sm text-green-700">
                      Your payment information is encrypted and secure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}