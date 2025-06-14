import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummary from '../components/checkout/OrderSummary';
import { VAT_RATE, SHIPPING_COSTS, convertToEGP } from '../utils/currencyUtils';

// Import Product type to extend from
import { Product } from '../types/product';

// Define CartItem based on the one in CartContext
interface CartItem extends Product {
  quantity: number;
}

interface OrderDetails {
  orderId: string;
  amount: number;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  createdAt: Date;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentResult {
  paymentId: string;
  lastFour: string;
  cardType: string;
}

type PaymentStatus = 'idle' | 'processing' | 'succeeded' | 'failed';

// Custom hook for order calculations
const useOrderCalculations = (cartItems: CartItem[], shippingMethod: string) => {
  return useMemo(() => {
    const safeCartItems = (Array.isArray(cartItems) ? cartItems : [])
      .filter((item): item is CartItem => 
        !!item && 
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.price === 'number' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0
      );

    const subtotal = safeCartItems.reduce<number>((sum, item) => {
      const price = convertToEGP(item.price || 0);
      const quantity = item.quantity || 0;
      return sum + (price * quantity);
    }, 0);
    
    const shippingCost = shippingMethod === 'express' ? SHIPPING_COSTS.express : SHIPPING_COSTS.standard;
    const tax = subtotal * VAT_RATE;
    const total = subtotal + shippingCost + tax;

    return {
      safeCartItems,
      subtotal,
      shippingCost,
      tax,
      total
    };
  }, [cartItems, shippingMethod]);
};

// Loading component
const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
    <div className="text-center bg-white p-8 rounded-xl shadow-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
      <p className="text-neutral-600 font-medium">{message}</p>
    </div>
  </div>
);

// Error component
const ErrorDisplay = ({ 
  title, 
  message, 
  actionText, 
  onAction 
}: { 
  title: string; 
  message: string; 
  actionText: string; 
  onAction: () => void; 
}) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md mx-auto">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-100">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">{title}</h2>
        <p className="text-neutral-600 mb-6">{message}</p>
        <button
          onClick={onAction}
          className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          {actionText}
        </button>
      </div>
    </div>
  </div>
);

// Success overlay component
const PaymentSuccessOverlay = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">Payment Successful!</h3>
        <p className="text-neutral-600 mb-4">Your order has been processed successfully.</p>
        <div className="animate-pulse text-sm text-neutral-500">Redirecting to confirmation page...</div>
      </div>
    </div>
  );
};

export default function CheckoutConfirmationPage() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { cartItems = [], clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data from location state with validation
  const shippingAddress = location.state?.shippingAddress as ShippingAddress;
  const shippingMethod = location.state?.shippingMethod || 'standard';
  
  // Calculate order totals
  const { safeCartItems, subtotal, shippingCost, tax, total } = useOrderCalculations(cartItems, shippingMethod);

  // Validate required data
  const isValidCheckout = useMemo(() => {
    return shippingAddress && 
           safeCartItems.length > 0 && 
           shippingAddress.firstName && 
           shippingAddress.email && 
           shippingAddress.address;
  }, [shippingAddress, safeCartItems]);

  // Initialize order details
  useEffect(() => {
    if (!isValidCheckout) {
      return;
    }

    if (!isInitialized) {
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      setOrderDetails({
        orderId,
        amount: total,
        items: safeCartItems,
        shippingAddress,
        paymentMethod: 'card',
        createdAt: new Date()
      });
      
      setIsInitialized(true);
    }
  }, [isValidCheckout, total, safeCartItems, shippingAddress, isInitialized]);

  // Handle payment success with better error handling
  const handlePaymentSuccess = useCallback(async (paymentResult: PaymentResult) => {
    try {
      setPaymentStatus('processing');
      setError(null);
      
      if (!orderDetails) {
        throw new Error('Order details not found');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, validate payment with backend
      if (Math.random() > 0.95) { // 5% chance of simulated failure
        throw new Error('Payment processing failed. Please try again.');
      }
      
      setPaymentStatus('succeeded');
      
      // Clear cart on successful payment
      await clearCart();
      
      // Redirect to order confirmation page
      setTimeout(() => {
        navigate(`/order-confirmation/${orderDetails.orderId}`, {
          state: {
            orderId: orderDetails.orderId,
            paymentId: paymentResult.paymentId,
            amount: orderDetails.amount,
            items: orderDetails.items,
            shippingAddress: orderDetails.shippingAddress,
            paymentMethod: orderDetails.paymentMethod,
            status: 'succeeded' as const,
            lastFour: paymentResult.lastFour,
            cardType: paymentResult.cardType,
            orderDate: orderDetails.createdAt
          }
        });
      }, 2000);
    } catch (error) {
      console.error('Payment processing error:', error);
      setPaymentStatus('failed');
      setError(error instanceof Error ? error.message : 'Payment processing failed');
    }
  }, [orderDetails, clearCart, navigate]);

  // Handle payment error
  const handlePaymentError = useCallback((error: any) => {
    console.error('Payment error:', error);
    setPaymentStatus('failed');
    setError(error?.message || 'Payment failed. Please try again.');
  }, []);

  // Retry payment
  const handleRetryPayment = useCallback(() => {
    setPaymentStatus('idle');
    setError(null);
  }, []);

  // Navigation handlers
  const goToShipping = useCallback(() => navigate('/checkout/shipping'), [navigate]);
  const goToCart = useCallback(() => navigate('/cart'), [navigate]);
  const goHome = useCallback(() => navigate('/'), [navigate]);

  // Early returns for error states
  if (!shippingAddress) {
    return (
      <ErrorDisplay
        title="Missing Shipping Information"
        message="Please complete the shipping information before proceeding to payment."
        actionText="Go to Shipping"
        onAction={goToShipping}
      />
    );
  }

  if (safeCartItems.length === 0) {
    return (
      <ErrorDisplay
        title="Your Cart is Empty"
        message="Add some items to your cart before proceeding to checkout."
        actionText="Continue Shopping"
        onAction={goHome}
      />
    );
  }

  if (!orderDetails) {
    return <LoadingSpinner message="Preparing your order..." />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm text-neutral-500 mb-4">
              <button onClick={goToCart} className="hover:text-primary-600 transition-colors">
                Cart
              </button>
              <span>→</span>
              <button onClick={goToShipping} className="hover:text-primary-600 transition-colors">
                Shipping
              </button>
              <span>→</span>
              <span className="text-primary-600 font-medium">Payment</span>
            </nav>
            <h1 className="text-3xl font-bold text-neutral-900">Secure Checkout</h1>
            <p className="text-neutral-600 mt-2">Complete your purchase securely</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-neutral-200">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-900">Payment Details</h2>
                </div>
                
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-800 text-sm font-medium">{error}</p>
                    </div>
                    {paymentStatus === 'failed' && (
                      <button
                        onClick={handleRetryPayment}
                        className="mt-3 text-sm text-red-700 hover:text-red-800 underline transition-colors"
                      >
                        Try again
                      </button>
                    )}
                  </div>
                )}
                
                <CheckoutForm 
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  isProcessing={paymentStatus === 'processing'}
                  disabled={paymentStatus === 'succeeded'}
                />
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <OrderSummary 
                  items={safeCartItems} 
                  subtotal={subtotal}
                  shippingCost={shippingCost}
                  tax={tax}
                  total={total}
                  shippingMethod={shippingMethod}
                  shippingAddress={shippingAddress}
                />
                
                {/* Security badges */}
                <div className="mt-6 p-4 bg-white rounded-xl shadow-sm border border-neutral-200">
                  <div className="flex items-center justify-center space-x-4 text-xs text-neutral-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      SSL Secured
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Protected
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success overlay */}
      <PaymentSuccessOverlay isVisible={paymentStatus === 'succeeded'} />
    </>
  );
}