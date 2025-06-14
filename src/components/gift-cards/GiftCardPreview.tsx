import { GiftCard } from '../../types/giftCard';
import { Gift, Mail, User, Calendar } from 'lucide-react';

interface GiftCardPreviewProps {
  giftCard: Omit<GiftCard, 'id' | 'isRedeemed' | 'createdAt' | 'updatedAt'>;
}

export default function GiftCardPreview({ giftCard }: GiftCardPreviewProps) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + (giftCard.expirationDays || 365));
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Card Header */}
      <div className="bg-primary-600 p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold">Gift Card</h3>
            <p className="text-primary-100">Evolv Fashion</p>
          </div>
          <div className="bg-white/20 p-2 rounded-lg">
            <Gift className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {/* Amount */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">Gift Card Value</p>
          <p className="text-4xl font-bold text-gray-900">${giftCard.amount.toFixed(2)}</p>
        </div>

        {/* Card Design */}
        <div 
          className="h-40 rounded-lg mb-6 flex items-center justify-center"
          style={{
            backgroundImage: `url(${giftCard.image || '/images/gift-card-default.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="bg-black bg-opacity-40 text-white p-4 rounded-lg text-center">
            <p className="text-lg font-semibold">Evolv Fashion</p>
            <p className="text-sm">Gift Card</p>
          </div>
        </div>

        {/* Card Details */}
        <div className="space-y-4">
          {giftCard.recipientName && (
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-medium">{giftCard.recipientName}</p>
              </div>
            </div>
          )}

          {giftCard.senderName && (
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium">{giftCard.senderName}</p>
              </div>
            </div>
          )}

          {giftCard.recipientEmail && giftCard.deliveryMethod === 'email' && (
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{giftCard.recipientEmail}</p>
              </div>
            </div>
          )}

          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Expires</p>
              <p className="font-medium">{formatDate(expirationDate)}</p>
            </div>
          </div>
        </div>

        {/* Personal Message */}
        {giftCard.message && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Personal Message</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 italic">"{giftCard.message}"</p>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500">
          This gift card can be redeemed at evolvfashion.com. Gift cards never expire.
          {giftCard.deliveryMethod === 'email' && (
            <span className="block mt-1">
              This gift card will be sent to {giftCard.recipientEmail} once payment is confirmed.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
