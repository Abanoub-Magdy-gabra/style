import { useState } from 'react';
import { CURRENCY } from '../../utils/currencyUtils';

type CheckoutFormProps = {
  onSuccess: (paymentResult: any) => void;
  onError: (error: any) => void;
  isProcessing: boolean;
  disabled?: boolean;
};

export default function CheckoutForm({ onSuccess, onError, isProcessing, disabled = false }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Validate field if it's been touched
    if (touched[name]) {
      validateField(name, String(newValue));
    }
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }
    
    // Validate field
    validateField(name, value);
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    
    // Split into groups of 4 digits
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    
    // Join with spaces
    return parts.join(' ');
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'cardNumber': {
        const cardNumber = value.replace(/\s/g, '');
        if (!cardNumber) {
          newErrors.cardNumber = 'Card number is required';
        } else if (!/^\d{16}$/.test(cardNumber)) {
          newErrors.cardNumber = 'Please enter a valid 16-digit card number';
        } else {
          delete newErrors.cardNumber;
        }
        break;
      }
      case 'cardName': {
        if (!value.trim()) {
          newErrors.cardName = 'Name on card is required';
        } else {
          delete newErrors.cardName;
        }
        break;
      }
      case 'expiryDate': {
        if (!value) {
          newErrors.expiryDate = 'Expiry date is required';
        } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value)) {
          newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
        } else {
          // Check if card is expired
          const [month, year] = value.split('/').map(Number);
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear() % 100;
          const currentMonth = currentDate.getMonth() + 1;
          
          if (year < currentYear || (year === currentYear && month < currentMonth)) {
            newErrors.expiryDate = 'This card has expired';
          } else {
            delete newErrors.expiryDate;
          }
        }
        break;
      }
      case 'cvv': {
        if (!value) {
          newErrors.cvv = 'CVV is required';
        } else if (!/^\d{3,4}$/.test(value)) {
          newErrors.cvv = 'Please enter a valid CVV (3 or 4 digits)';
        } else {
          delete newErrors.cvv;
        }
        break;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);
    
    // Validate all fields
    let isValid = true;
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'saveCard') { // Skip saveCard from validation
        isValid = validateField(key, String(value)) && isValid;
      }
    });
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // In a real app, you would send the payment details to your backend
      // Here we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess({
        paymentId: `pay_${Math.random().toString(36).substr(2, 16)}`,
        status: 'succeeded',
        timestamp: new Date().toISOString(),
        lastFour: formData.cardNumber.slice(-4),
        cardType: getCardType(formData.cardNumber)
      });
      
    } catch (err) {
      console.error('Payment error:', err);
      setErrors({
        payment: 'An unexpected error occurred. Please try again.'
      });
      onError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '');
    if (/^4/.test(number)) return 'Visa';
    if (/^5[1-5]/.test(number)) return 'Mastercard';
    if (/^3[47]/.test(number)) return 'American Express';
    if (/^6(?:011|5)/.test(number)) return 'Discover';
    return 'Card';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="border border-neutral-200 rounded-md p-4 space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-neutral-700 mb-1">
              Card number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formatCardNumber(formData.cardNumber)}
              onChange={(e) => {
                e.target.value = formatCardNumber(e.target.value);
                handleChange(e);
              }}
              maxLength={19}
              placeholder="0000 0000 0000 0000"
              className={`mt-1 block w-full rounded-md border ${
                errors.cardNumber ? 'border-red-500' : 'border-neutral-300'
              } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              onBlur={handleBlur}
            />
          </div>
          
          <div>
            <label htmlFor="cardName" className="block text-sm font-medium text-neutral-700 mb-1">
              Name on card
            </label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="John Doe"
              className={`mt-1 block w-full rounded-md border ${
                errors.cardName ? 'border-red-500' : 'border-neutral-300'
              } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-neutral-700 mb-1">
                Expiry date
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={(e) => {
                  e.target.value = formatExpiryDate(e.target.value);
                  handleChange(e);
                }}
                maxLength={5}
                placeholder="MM/YY"
                className={`mt-1 block w-full rounded-md border ${
                errors.expiryDate ? 'border-red-500' : 'border-neutral-300'
              } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                onBlur={handleBlur}
              />
            </div>
            
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-neutral-700 mb-1">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={4}
                placeholder="123"
                className={`mt-1 block w-full rounded-md border ${
                  errors.cvv ? 'border-red-500' : 'border-neutral-300'
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            id="save-card"
            name="saveCard"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
            checked={formData.saveCard}
            onChange={handleChange}
          />
          <label htmlFor="save-card" className="ml-2 block text-sm text-neutral-700">
            Save card for future purchases
          </label>
        </div>
        
        {Object.entries(errors).map(([field, message]) => (
          <div key={field} className="text-sm text-red-600 p-2 bg-red-50 rounded-md mt-1">
            <p>{message}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting || isProcessing || disabled}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
            (isSubmitting || isProcessing || disabled) ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting || isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Pay Now'
          )}
        </button>
        
        <p className="mt-3 text-center text-sm text-neutral-500">
          Your payment in {CURRENCY.name} ({CURRENCY.code}) is secured with 256-bit SSL encryption
        </p>
        
        <div className="mt-6 flex justify-center space-x-6">
          {['visa', 'mastercard', 'meeza', 'fawry'].map((type) => (
            <div key={type} className="h-8 flex items-center">
              <div className="text-xs font-medium text-neutral-400">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
