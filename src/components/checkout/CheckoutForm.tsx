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

    if (isSubmitting || isProcessing || disabled) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // ⚠️ CRITICAL: THIS IS DEMO MODE ONLY - NO REAL PAYMENT PROCESSING ⚠️
      console.log('🚫 DEMO MODE: NO REAL PAYMENT WILL BE PROCESSED');
      console.log('🎭 Simulating payment for demonstration purposes only');
      
      // Simulate payment processing delay
      const processingTime = Math.random() * 1000 + 500; // 500ms to 1.5s
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Generate demo payment result (NO REAL TRANSACTION OCCURS)
      const paymentResult = {
        paymentId: `DEMO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'demo_success',
        timestamp: new Date().toISOString(),
        lastFour: formData.cardNumber.replace(/\s/g, '').slice(-4),
        cardType: getCardType(formData.cardNumber),
        isDemoMode: true,
        realPayment: false, // Explicitly mark as not real
        demoNotice: 'This is a demonstration - no actual payment was processed'
      };
      
      console.log('🎭 DEMO: Payment simulation completed successfully');
      console.log('💡 No money was charged - this is for demonstration only');
      
      onSuccess(paymentResult);
      
    } catch (err) {
      console.error('Demo payment simulation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Demo payment simulation failed. Please try again.';
      setErrors({
        payment: errorMessage
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

  const isFormDisabled = isSubmitting || isProcessing || disabled;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* PROMINENT DEMO NOTICE */}
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-bold text-red-800">⚠️ DEMO MODE - NO REAL PAYMENTS ⚠️</h3>
            <div className="mt-2 text-sm text-red-700">
              <p className="font-semibold">This is a demonstration checkout system.</p>
              <p>• No real payment will be processed</p>
              <p>• No money will be charged to any card</p>
              <p>• Use any test card details (e.g., 4242 4242 4242 4242)</p>
              <p>• This is for demonstration purposes only</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="border border-neutral-200 rounded-md p-4 space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-neutral-700 mb-1">
              Card number (Demo - use any 16 digits)
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
              onBlur={handleBlur}
              maxLength={19}
              placeholder="4242 4242 4242 4242"
              disabled={isFormDisabled}
              className={`mt-1 block w-full rounded-md border ${
                errors.cardNumber ? 'border-red-500' : 'border-neutral-300'
              } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-neutral-100 disabled:cursor-not-allowed`}
            />
            {errors.cardNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="cardName" className="block text-sm font-medium text-neutral-700 mb-1">
              Name on card (Demo - any name)
            </label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="John Doe"
              disabled={isFormDisabled}
              className={`mt-1 block w-full rounded-md border ${
                errors.cardName ? 'border-red-500' : 'border-neutral-300'
              } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-neutral-100 disabled:cursor-not-allowed`}
            />
            {errors.cardName && (
              <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-neutral-700 mb-1">
                Expiry date (Demo)
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
                onBlur={handleBlur}
                maxLength={5}
                placeholder="12/28"
                disabled={isFormDisabled}
                className={`mt-1 block w-full rounded-md border ${
                errors.expiryDate ? 'border-red-500' : 'border-neutral-300'
              } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-neutral-100 disabled:cursor-not-allowed`}
              />
              {errors.expiryDate && (
                <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-neutral-700 mb-1">
                CVV (Demo)
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
                disabled={isFormDisabled}
                className={`mt-1 block w-full rounded-md border ${
                  errors.cvv ? 'border-red-500' : 'border-neutral-300'
                } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-neutral-100 disabled:cursor-not-allowed`}
              />
              {errors.cvv && (
                <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            id="save-card"
            name="saveCard"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded disabled:cursor-not-allowed"
            checked={formData.saveCard}
            onChange={handleChange}
            disabled={isFormDisabled}
          />
          <label htmlFor="save-card" className="ml-2 block text-sm text-neutral-700">
            Save card for future purchases (Demo only - not functional)
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
          disabled={isFormDisabled}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${
            isFormDisabled ? 'opacity-75 cursor-not-allowed hover:bg-primary-600' : ''
          }`}
        >
          {isSubmitting || isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              🎭 Simulating Payment...
            </>
          ) : (
            '🎭 Complete Demo Order (No Real Payment)'
          )}
        </button>
        
        <p className="mt-3 text-center text-sm text-red-600 font-semibold">
          ⚠️ DEMO MODE - No real payment will be processed ⚠️
        </p>
        
        <div className="mt-6 flex justify-center space-x-6">
          {['Demo Only', 'No Real Charges', 'Test Mode'].map((text) => (
            <div key={text} className="h-8 flex items-center">
              <div className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded">
                {text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}