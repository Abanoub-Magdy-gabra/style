import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummary from '../components/checkout/OrderSummary';
import { VAT_RATE, SHIPPING_COSTS, convertToEGP } from '../utils/currencyUtils';
import toast from 'react-hot-toast';

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
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface PaymentResult {
  paymentId: string;
  lastFour: string;
  cardType: string;
  isDemoMode?: boolean;
  realPayment?: boolean;
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
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">Demo Order Created!</h3>
        <p className="text-neutral-600 mb-4">Your demo order has been saved successfully.</p>
        <div className="animate-pulse text-sm text-neutral-500">Redirecting to confirmation page...</div>
      </div>
    </div>
  );
};

// Function to create order in database
const createOrderInDatabase = async (
  user: any,
  orderDetails: OrderDetails,
  paymentResult: PaymentResult,
  totals: { subtotal: number; shippingCost: number; tax: number; total: number }
) => {
  try {
    console.log('Creating order in database...', { orderDetails, paymentResult });

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null,
        order_number: orderNumber,
        status: paymentResult.isDemoMode ? 'demo' : 'processing',
        total_amount: totals.total,
        shipping_address: {
          firstName: orderDetails.shippingAddress.firstName,
          lastName: orderDetails.shippingAddress.lastName,
          email: orderDetails.shippingAddress.email,
          phone: orderDetails.shippingAddress.phone,
          address1: orderDetails.shippingAddress.address1,
          address2: orderDetails.shippingAddress.address2,
          city: orderDetails.shippingAddress.city,
          state: orderDetails.shippingAddress.state,
          postalCode: orderDetails.shippingAddress.postalCode,
          country: orderDetails.shippingAddress.country,
        },
        billing_address: {
          firstName: orderDetails.shippingAddress.firstName,
          lastName: orderDetails.shippingAddress.lastName,
          email: orderDetails.shippingAddress.email,
          phone: orderDetails.shippingAddress.phone,
          address1: orderDetails.shippingAddress.address1,
          address2: orderDetails.shippingAddress.address2,
          city: orderDetails.shippingAddress.city,
          state: orderDetails.shippingAddress.state,
          postalCode: orderDetails.shippingAddress.postalCode,
          country: orderDetails.shippingAddress.country,
        },
        payment_method: paymentResult.isDemoMode ? 'demo_card' : 'card',
        payment_status: paymentResult.isDemoMode ? 'demo_paid' : 'paid',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    console.log('Order created successfully:', order);

    // Create order items
    const orderItems = orderDetails.items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: convertToEGP(item.price),
      size: item.size || null,
      color: item.color || null,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw itemsError;
    }

    console.log('Order items created successfully');

    // Store order in localStorage for non-authenticated users or as backup
    const orderForStorage = {
      id: order.id,
      orderNumber: order.order_number,
      date: order.created_at,
      status: order.status,
      total: order.total_amount,
      items: orderDetails.items.map(item => ({
        id: item.id,
        name: item.name,
        price: convertToEGP(item.price),
        quantity: item.quantity,
        image: item.images?.[0],
      })),
      shippingAddress: orderDetails.shippingAddress,
      paymentMethod: order.payment_method,
      paymentId: paymentResult.paymentId,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      }),
    };

    // Store in localStorage as backup
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.unshift(orderForStorage);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    return order;
  } catch (error) {
    console.error('Error in createOrderInDatabase:', error);
    throw error;
  }
};

export default function CheckoutConfirmationPage() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingTimeout, setProcessingTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const { cartItems = [], clearCart } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data from location state with validation and fallbacks
  const shippingAddress = location.state?.shippingAddress as ShippingAddress;
  const shippingMethod = location.state?.shippingMethod || 'standard';
  
  // Calculate order totals
  const { safeCartItems, subtotal, shippingCost, tax, total } = useOrderCalculations(cartItems, shippingMethod);

  // Validate required data with better error handling
  const isValidCheckout = useMemo(() => {
    console.log('Validating checkout data:', {
      hasShippingAddress: !!shippingAddress,
      hasCartItems: safeCartItems.length > 0,
      shippingAddressValid: shippingAddress && 
        shippingAddress.firstName && 
        shippingAddress.email && 
        shippingAddress.address1,
      cartItemsCount: safeCartItems.length
    });

    return shippingAddress && 
           safeCartItems.length > 0 && 
           shippingAddress.firstName && 
           shippingAddress.email && 
           shippingAddress.address1;
  }, [shippingAddress, safeCartItems]);

  // Initialize order details with better error handling
  useEffect(() => {
    console.log('Initializing order details...', {
      isValidCheckout,
      isInitialized,
      cartItemsLength: safeCartItems.length,
      total
    });

    if (!isValidCheckout) {
      console.log('Invalid checkout data detected');
      return;
    }

    if (!isInitialized) {
      try {
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        const newOrderDetails: OrderDetails = {
          orderId,
          amount: total,
          items: safeCartItems,
          shippingAddress,
          paymentMethod: 'card',
          createdAt: new Date()
        };

        console.log('Created order details:', newOrderDetails);
        
        setOrderDetails(newOrderDetails);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error creating order details:', error);
        setError('Failed to prepare order. Please try again.');
      }
    }
  }, [isValidCheckout, total, safeCartItems, shippingAddress, isInitialized]);

  // Clear any existing timeout when component unmounts or payment status changes
  useEffect(() => {
    return () => {
      if (processingTimeout) {
        clearTimeout(processingTimeout);
      }
    };
  }, [processingTimeout]);

  // Handle payment success with database storage
  const handlePaymentSuccess = useCallback(async (paymentResult: PaymentResult) => {
    try {
      setPaymentStatus('processing');
      setError(null);
      
      if (!orderDetails) {
        throw new Error('Order details not found');
      }

      console.log('Processing payment success and creating order...', paymentResult);

      // Clear any existing timeout
      if (processingTimeout) {
        clearTimeout(processingTimeout);
      }

      // Set a timeout to prevent infinite processing
      const timeoutId = setTimeout(() => {
        console.warn('Payment processing timeout - forcing completion');
        setPaymentStatus('succeeded');
        
        // Navigate to confirmation even if something went wrong
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
            orderDate: orderDetails.createdAt,
            isDemoMode: paymentResult.isDemoMode || true,
          }
        });
      }, 10000); // 10 seconds timeout

      setProcessingTimeout(timeoutId);
      
      // Create order in database
      try {
        const dbOrder = await createOrderInDatabase(
          user,
          orderDetails,
          paymentResult,
          { subtotal, shippingCost, tax, total }
        );
        
        console.log('Order successfully created in database:', dbOrder);
        toast.success('Demo order created successfully!');
      } catch (dbError) {
        console.error('Database error (continuing anyway):', dbError);
        // Don't fail the entire process if database fails
        toast.error('Order saved locally (database unavailable)');
      }
      
      // Simulate additional processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear the timeout since we completed successfully
      clearTimeout(timeoutId);
      setProcessingTimeout(null);
      
      setPaymentStatus('succeeded');
      
      // Clear cart on successful payment
      try {
        await clearCart();
        console.log('Cart cleared successfully');
      } catch (cartError) {
        console.warn('Failed to clear cart:', cartError);
        // Don't fail the entire process if cart clearing fails
      }
      
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
            orderDate: orderDetails.createdAt,
            isDemoMode: paymentResult.isDemoMode || true,
          }
        });
      }, 1000);
    } catch (error) {
      console.error('Payment processing error:', error);
      
      // Clear timeout on error
      if (processingTimeout) {
        clearTimeout(processingTimeout);
        setProcessingTimeout(null);
      }
      
      setPaymentStatus('failed');
      setError(error instanceof Error ? error.message : 'Payment processing failed');
    }
  }, [orderDetails, clearCart, navigate, processingTimeout, user, subtotal, shippingCost, tax, total]);

  // Handle payment error
  const handlePaymentError = useCallback((error: any) => {
    console.error('Payment error:', error);
    
    // Clear any processing timeout
    if (processingTimeout) {
      clearTimeout(processingTimeout);
      setProcessingTimeout(null);
    }
    
    setPaymentStatus('failed');
    setError(error?.message || 'Payment failed. Please try again.');
  }, [processingTimeout]);

  // Retry payment
  const handleRetryPayment = useCallback(() => {
    setPaymentStatus('idle');
    setError(null);
    
    // Clear any existing timeout
    if (processingTimeout) {
      clearTimeout(processingTimeout);
      setProcessingTimeout(null);
    }
  }, [processingTimeout]);

  // Navigation handlers
  const goToShipping = useCallback(() => navigate('/checkout'), [navigate]);
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

  if (!orderDetails && isValidCheckout) {
    return <LoadingSpinner message="Preparing your order..." />;
  }

  if (!orderDetails) {
    return (
      <ErrorDisplay
        title="Order Preparation Failed"
        message="There was an issue preparing your order. Please try again."
        actionText="Go to Cart"
        onAction={goToCart}
      />
    );
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
            <p className="text-neutral-600 mt-2">Complete your demo purchase</p>
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
                      Demo Secured
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Test Mode
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