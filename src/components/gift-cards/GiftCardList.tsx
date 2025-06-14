import { GiftCard } from '../../types/giftCard';
import { Gift, ArrowRight } from 'lucide-react';

interface GiftCardListProps {
  onSelectCard: (card: Omit<GiftCard, 'id' | 'isRedeemed' | 'createdAt' | 'updatedAt'>) => void;
}

export default function GiftCardList({ onSelectCard }: GiftCardListProps) {
  // In a real app, these would come from an API or config
  const popularGiftCards = [
    {
      amount: 25,
      description: '$25 Gift Card',
      image: '/images/gift-card-1.jpg',
      isPhysical: false,
      deliveryMethod: 'email' as const,
      recipientEmail: '',
      recipientName: '',
      senderName: '',
      message: '',
      expirationDays: 365,
    },
    {
      amount: 50,
      description: '$50 Gift Card',
      image: '/images/gift-card-2.jpg',
      isPhysical: true,
      deliveryMethod: 'physical' as const,
      recipientEmail: '',
      recipientName: '',
      senderName: '',
      message: '',
      expirationDays: 365,
    },
    {
      amount: 100,
      description: '$100 Gift Card',
      image: '/images/gift-card-3.jpg',
      isPhysical: false,
      deliveryMethod: 'email' as const,
      recipientEmail: '',
      recipientName: '',
      senderName: '',
      message: '',
      expirationDays: 365,
    },
  ];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Popular Gift Cards
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Perfect for any occasion - birthdays, holidays, or just because.
          </p>
        </div>

        <div className="mt-12 grid gap-8 max-w-lg mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-none">
          {popularGiftCards.map((card, index) => (
            <div
              key={index}
              className="flex flex-col rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex-1 bg-white p-6 flex flex-col">
                <div className="flex-shrink-0 bg-primary-100 rounded-lg p-4 flex items-center justify-center h-40">
                  <Gift className="h-20 w-20 text-primary-600" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="mt-4">
                    <p className="text-2xl font-semibold text-gray-900 text-center">
                      ${card.amount}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 text-center">
                      {card.deliveryMethod === 'email' ? 'E-gift Card' : 'Physical Card'}
                    </p>
                  </div>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => onSelectCard(card)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Buy Now <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-lg font-medium text-gray-900">Looking for a custom amount?</h3>
          <p className="mt-2 text-gray-600">
            Choose any amount between $5 and $1,000
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => onSelectCard({
                amount: 0,
                description: 'Custom Amount Gift Card',
                image: '/images/gift-card-custom.jpg',
                isPhysical: false,
                deliveryMethod: 'email',
                recipientEmail: '',
                recipientName: '',
                senderName: '',
                message: '',
                expirationDays: 365,
              })}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Custom Amount
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
