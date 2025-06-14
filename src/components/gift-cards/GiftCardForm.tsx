import { useState, ChangeEvent } from 'react';
import { GiftCard, giftCardAmounts, giftCardDesigns } from '../../types/giftCard';
import { CreditCard, Mail, User, MessageSquare, Gift } from 'lucide-react';

interface GiftCardFormProps {
  onSubmit: (giftCard: Omit<GiftCard, 'id' | 'isRedeemed' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
}

export default function GiftCardForm({ onSubmit, isLoading = false }: GiftCardFormProps) {
  const [amount, setAmount] = useState<number>(giftCardAmounts[0].value);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedDesign, setSelectedDesign] = useState<string>(giftCardDesigns[0].id);
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'physical'>('email');
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    senderName: '',
    message: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmountChange = (value: number) => {
    setAmount(value);
    if (value !== 0) {
      setCustomAmount('');
    }
  };

  const handleCustomAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setCustomAmount(value);
      if (value) {
        setAmount(parseInt(value, 10));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (amount <= 0) {
      alert('Please select a valid amount');
      return;
    }
    
    if (deliveryMethod === 'email' && !formData.recipientEmail) {
      alert('Please enter recipient email');
      return;
    }
    
    if (!formData.recipientName) {
      alert('Please enter recipient name');
      return;
    }
    
    onSubmit({
      amount,
      image: giftCardDesigns.find(d => d.id === selectedDesign)?.image || '',
      description: `$${amount} Gift Card`,
      isPhysical: deliveryMethod === 'physical',
      deliveryMethod,
      recipientEmail: formData.recipientEmail,
      recipientName: formData.recipientName,
      message: formData.message,
      senderName: formData.senderName,
      expirationDays: 365,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Amount Selection */}
      <div>
        <h3 className="text-lg font-medium mb-4">Select Amount</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {giftCardAmounts.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleAmountChange(item.value)}
              className={`py-3 px-4 border rounded-lg text-center transition-colors ${
                amount === item.value && item.value !== 0
                  ? 'border-primary-600 bg-primary-50 text-primary-600'
                  : 'border-gray-300 hover:border-primary-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        
        {amount === 0 && (
          <div className="mt-4">
            <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Custom Amount (USD)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                name="customAmount"
                id="customAmount"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border"
                placeholder="0.00"
              />
            </div>
          </div>
        )}
      </div>

      {/* Design Selection */}
      <div>
        <h3 className="text-lg font-medium mb-4">Choose a Design</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {giftCardDesigns.map((design) => (
            <div key={design.id} className="relative">
              <button
                type="button"
                onClick={() => setSelectedDesign(design.id)}
                className={`w-full aspect-[3/2] rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedDesign === design.id
                    ? 'border-primary-600 ring-2 ring-primary-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-sm text-gray-500">{design.name}</span>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Method */}
      <div>
        <h3 className="text-lg font-medium mb-4">Delivery Method</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setDeliveryMethod('email')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              deliveryMethod === 'email'
                ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-500'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-500">Delivered instantly</p>
              </div>
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => setDeliveryMethod('physical')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              deliveryMethod === 'physical'
                ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-500'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <Gift className="h-5 w-5 text-primary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Physical Card</p>
                <p className="text-sm text-gray-500">Shipped in 2-3 business days</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Recipient Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Recipient Information</h3>
        
        <div>
          <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient's Name <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="recipientName"
              id="recipientName"
              value={formData.recipientName}
              onChange={handleInputChange}
              required
              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
              placeholder="John Doe"
            />
          </div>
        </div>

        {deliveryMethod === 'email' && (
          <div>
            <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient's Email <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="recipientEmail"
                id="recipientEmail"
                value={formData.recipientEmail}
                onChange={handleInputChange}
                required={deliveryMethod === 'email'}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                placeholder="recipient@example.com"
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-1">
            From (Your Name)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="senderName"
              id="senderName"
              value={formData.senderName}
              onChange={handleInputChange}
              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
              placeholder="Your Name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Personal Message (Optional)
          </label>
          <div className="mt-1">
            <textarea
              name="message"
              id="message"
              rows={3}
              value={formData.message}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="Add a personal message..."
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            'Processing...'
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Purchase Gift Card for ${amount}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
