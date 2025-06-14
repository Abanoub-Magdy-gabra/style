import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { X, Plus, Minus } from 'lucide-react';
import ProceedToCheckoutButton from '../components/checkout/ProceedToCheckoutButton';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 9.99 : 0; // Example shipping cost
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-serif font-bold mb-4">Your Cart</h1>
        <p className="text-lg text-gray-600 mb-6">Your cart is currently empty</p>
        <Link
          to="/shop"
          className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold mb-8">Your Cart ({totalItems})</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 border-b pb-6"
            >
              <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={item.images?.[0] || ''}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-600">
                      {item.colors?.[0] || 'N/A'} / {item.sizes?.[0] || 'One Size'}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-gray-800"
                    aria-label="Remove item"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-between items-center pt-4">
            <Link
              to="/shop"
              className="text-gray-600 hover:text-black flex items-center"
            >
              &larr; Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-gray-600 hover:text-red-600 text-sm"
            >
              Clear Cart
            </button>
          </div>
          
        </div>
        
        <div className="lg:pl-8">
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-2">
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <ProceedToCheckoutButton />
            </div>
            
            <p className="mt-4 text-center text-sm text-gray-500">
              Secure checkout powered by our payment partners
            </p>
            
            <div className="mt-4 flex justify-center space-x-6">
              {['visa', 'mastercard', 'amex', 'discover'].map((type) => (
                <div key={type} className="h-6 flex items-center">
                  <div className="text-xs font-medium text-gray-400">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-sm text-gray-600">
              <h3 className="font-medium mb-2">Need help?</h3>
              <p className="mb-2">
                Contact us at{' '}
                <a href="mailto:support@example.com" className="text-black hover:underline">
                  support@example.com
                </a>
              </p>
              <p>We're here to help with any questions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
