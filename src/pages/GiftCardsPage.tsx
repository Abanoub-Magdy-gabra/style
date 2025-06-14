import { useNavigate } from 'react-router-dom';
import { Gift, CreditCard, Mail, GiftIcon } from 'lucide-react';
import GiftCardList from '../components/gift-cards/GiftCardList';

const GiftCardsPage = () => {
  const navigate = useNavigate();
  const handleSelectCard = (card: any) => {
    navigate('/gift-cards/purchase', { state: { initialValues: card } });
  };

  const features = [
    {
      name: 'Instant Delivery',
      description: 'E-gift cards delivered via email within minutes.',
      icon: Mail,
    },
    {
      name: 'No Expiration',
      description: 'Our gift cards never expire, so take your time to use them.',
      icon: Gift,
    },
    {
      name: 'Secure Payment',
      description: 'All transactions are secure and encrypted.',
      icon: CreditCard,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:flex lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              Gift Cards
            </h2>
            <p className="mt-5 text-xl text-primary-100">
              Give the perfect gift of sustainable fashion.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/gift-cards/purchase')}
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Buy a Gift Card
              </button>
              <button
                onClick={() => navigate('/gift-cards/redeem')}
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 md:py-4 md:text-lg md:px-10"
              >
                Redeem a Gift Card
              </button>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:flex-shrink-0 lg:flex lg:items-center">
            <div className="inline-flex items-center justify-center h-64 w-64 rounded-full bg-white/10">
              <GiftIcon className="h-32 w-32 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Gift Cards</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              The Perfect Gift for Any Occasion
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Whether it's a birthday, holiday, or just because, an Evolv Fashion gift card is always a great choice.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gift Card List */}
      <GiftCardList onSelectCard={handleSelectCard} />

      {/* How It Works */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple & Easy
            </p>
          </div>

          <div className="mt-10">
            <div className="relative">
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                  <dl className="rounded-lg bg-white shadow-lg md:grid md:grid-cols-3">
                    <div className="flex flex-col border-b border-gray-100 p-6 text-center md:border-0 md:border-r">
                      <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                        Choose Amount
                      </dt>
                      <dd className="order-1 text-5xl font-extrabold text-primary-600">
                        1
                      </dd>
                    </div>
                    <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center md:border-0 md:border-l md:border-r">
                      <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                        Personalize
                      </dt>
                      <dd className="order-1 text-5xl font-extrabold text-primary-600">
                        2
                      </dd>
                    </div>
                    <div className="flex flex-col border-t border-gray-100 p-6 text-center md:border-0 md:border-l">
                      <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                        Send & Enjoy
                      </dt>
                      <dd className="order-1 text-5xl font-extrabold text-primary-600">
                        3
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to make someone's day?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-100">
            Give the gift of sustainable fashion with an Evolv Fashion gift card.
          </p>
          <button
            onClick={() => navigate('/gift-cards/purchase')}
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 sm:w-auto"
          >
            Buy a Gift Card Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftCardsPage;
