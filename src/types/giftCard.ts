export interface GiftCard {
  id: string;
  amount: number;
  image: string;
  description: string;
  isPhysical: boolean;
  deliveryMethod: 'email' | 'physical';
  recipientEmail?: string;
  recipientName?: string;
  message?: string;
  senderName?: string;
  expirationDays: number;
  isRedeemed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const giftCardAmounts = [
  { value: 25, label: '$25' },
  { value: 50, label: '$50' },
  { value: 100, label: '$100' },
  { value: 200, label: '$200' },
  { value: 0, label: 'Custom Amount' },
];

export const giftCardDesigns = [
  {
    id: 'design-1',
    name: 'Elegant Floral',
    image: '/images/gift-cards/design-1.jpg',
  },
  {
    id: 'design-2',
    name: 'Minimalist',
    image: '/images/gift-cards/design-2.jpg',
  },
  {
    id: 'design-3',
    name: 'Geometric',
    image: '/images/gift-cards/design-3.jpg',
  },
  {
    id: 'design-4',
    name: 'Seasonal',
    image: '/images/gift-cards/design-4.jpg',
  },
];
