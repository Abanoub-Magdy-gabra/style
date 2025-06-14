import { useState } from 'react';
import { CheckCircle, XCircle, Gift } from 'lucide-react';

const GiftCardRedeemPage = () => {
  const [code, setCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemStatus, setRedeemStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setRedeemStatus('error');
      setErrorMessage('Please enter a gift card code');
      return;
    }
    
    setIsRedeeming(true);
    setRedeemStatus('idle');
    
    try {
      // In a real app, you would make an API call to validate and redeem the gift card
      console.log('Redeeming gift card:', code);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success for demo purposes
      // In a real app, you would check the API response
      const isSuccess = Math.random() > 0.3; // 70% success rate for demo
      
      if (isSuccess) {
        setRedeemStatus('success');
        // In a real app, you would add the gift card balance to the user's account
        // and redirect to the cart or account page
      } else {
        setRedeemStatus('error');
        setErrorMessage('Invalid or expired gift card code');
      }
    } catch (error) {
      console.error('Error redeeming gift card:', error);
      setRedeemStatus('error');
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 mb-4">
            <Gift className="h-6 w-6 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Redeem Gift Card</h1>
          <p className="text-gray-600">Enter your gift card code below to add funds to your account</p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="giftCardCode" className="block text-sm font-medium text-gray-700 mb-1">
                Gift Card Code
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="giftCardCode"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    if (redeemStatus !== 'idle') setRedeemStatus('idle');
                  }}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  aria-describedby="gift-card-code"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500" id="gift-card-code">
                Enter the code found on your gift card or in your email.
              </p>
            </div>

            {redeemStatus === 'success' && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Gift Card Redeemed!</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Your gift card has been successfully added to your account balance.</p>
                    </div>
                    <div className="mt-4">
                      <div className="-mx-2 -my-1.5 flex">
                        <button
                          type="button"
                          className="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
                          onClick={() => {
                            // In a real app, you would redirect to the cart or account page
                            setCode('');
                            setRedeemStatus('idle');
                          }}
                        >
                          Continue Shopping
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {redeemStatus === 'error' && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Unable to redeem gift card</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{errorMessage}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isRedeeming}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isRedeeming
                    ? 'bg-primary-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }`}
              >
                {isRedeeming ? 'Processing...' : 'Redeem Gift Card'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Don't have a gift card? <a href="/gift-cards" className="font-medium text-primary-600 hover:text-primary-500">Purchase one here</a></p>
        </div>
      </div>
    </div>
  );
};

export default GiftCardRedeemPage;
