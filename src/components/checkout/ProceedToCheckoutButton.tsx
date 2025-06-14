import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import CheckoutModal from './CheckoutModal';

type ProceedToCheckoutButtonProps = {
  className?: string;
  disabled?: boolean;
};

export default function ProceedToCheckoutButton({ 
  className = '',
  disabled = false 
}: ProceedToCheckoutButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { cartItems } = useCart();

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Disable button if cart is empty or button is explicitly disabled
  const isDisabled = disabled || cartItems.length === 0;

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
      >
        Proceed to Checkout
      </button>
      
      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose}
      />
    </>
  );
}
