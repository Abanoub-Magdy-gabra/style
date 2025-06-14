import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GiftCard } from '../types/giftCard';
import GiftCardForm from '../components/gift-cards/GiftCardForm';
import GiftCardPreview from '../components/gift-cards/GiftCardPreview';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const GiftCardPurchasePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [giftCard, setGiftCard] = useState<Omit<GiftCard, 'id' | 'isRedeemed' | 'createdAt' | 'updatedAt'> | null>(null);

  const handleSubmit = async (formData: Omit<GiftCard, 'id' | 'isRedeemed' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, you would make an API call to process the payment and create the gift card
      console.log('Submitting gift card:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set the gift card data to show preview
      setGiftCard(formData);
      
      // In a real app, you would redirect to a success page or show a success message
      toast.success('Gift card purchased successfully!');
      
      // Scroll to the preview
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    } catch (error) {
      console.error('Error purchasing gift card:', error);
      toast.error('Failed to purchase gift card. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primary-600 hover:text-primary-800 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Purchase a Gift Card</h1>
          <p className="mt-2 text-gray-600">Give the gift of sustainable fashion</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Gift Card Details</h2>
            <GiftCardForm 
              onSubmit={handleSubmit} 
              isLoading={isSubmitting} 
            />
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            <h2 className="text-xl font-semibold mb-6">Preview</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              {giftCard ? (
                <GiftCardPreview giftCard={giftCard} />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Your gift card preview will appear here</p>
                  <p className="text-sm mt-2">Fill out the form to see a preview</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Gift Card Terms</h3>
              <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
                <li>Gift cards never expire</li>
                <li>No fees or expiration dates</li>
                <li>Can be used online at evolvfashion.com</li>
                <li>Not redeemable for cash unless required by law</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCardPurchasePage;
