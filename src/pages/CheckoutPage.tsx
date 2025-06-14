import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummary from '../components/checkout/OrderSummary';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems = [] } = useCart();
  const [isProcessing] = useState(false);

  const handlePaymentSuccess = (paymentResult: any) => {
    // Handle successful payment
    console.log('Payment successful:', paymentResult);
    navigate('/checkout/confirmation', {
      state: {
        paymentResult,
        // Include any other necessary data
      }
    });
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    // Handle payment error (show error message to user)
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-serif font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-lg text-gray-600 mb-6">Please add some items to your cart before checking out</p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
          <CheckoutForm 
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            isProcessing={isProcessing}
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          <OrderSummary 
            items={cartItems}
            subtotal={cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
            shippingCost={0} // Free shipping
            tax={cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1} // 10% tax
            total={cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1} // Subtotal + tax
            shippingMethod="standard"
            shippingAddress={{}}
          />
        </div>
      </div>
    </div>
  );
}
