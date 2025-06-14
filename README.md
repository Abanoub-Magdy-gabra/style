# StyleSphere - Sustainable Fashion E-commerce

A modern, sustainable fashion e-commerce platform built with React, TypeScript, and Supabase.

## Features

- 🛍️ **Product Catalog** - Browse sustainable fashion items with detailed information
- 🛒 **Shopping Cart** - Add items to cart with size and color selection
- 👤 **User Authentication** - Secure login and registration with Supabase Auth
- 🎨 **Style Quiz** - AI-powered style recommendations based on user preferences
- 💳 **Checkout Process** - Complete order processing with payment integration
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- ♻️ **Sustainability Focus** - Transparency in product sustainability scores
- 🎁 **Gift Cards** - Purchase and redeem gift cards
- 📝 **Blog** - Fashion and sustainability content
- 🔍 **Search & Filters** - Advanced product filtering and search

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Icons**: Lucide React, Heroicons
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stylesphere
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── blog/           # Blog-related components
│   ├── checkout/       # Checkout process components
│   ├── common/         # Shared components
│   ├── gift-cards/     # Gift card components
│   ├── home/           # Homepage components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── product/        # Product-related components
│   ├── search/         # Search functionality
│   └── shop/           # Shopping page components
├── contexts/           # React Context providers
├── data/              # Static data and mock data
├── hooks/             # Custom React hooks
├── lib/               # Third-party library configurations
├── pages/             # Page components
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Key Features

### Sustainability Focus
- Every product has a sustainability score
- Transparent information about materials and production
- Focus on eco-friendly and ethical fashion

### AI-Powered Style Recommendations
- Style quiz to determine user preferences
- Personalized product recommendations
- Style profile management

### Complete E-commerce Flow
- Product browsing with advanced filters
- Shopping cart with persistent storage
- Secure checkout process
- Order management and tracking

### User Experience
- Responsive design for all devices
- Fast loading with optimized images
- Intuitive navigation and search
- Accessibility considerations

## Database Schema

The application uses Supabase with the following main tables:
- `profiles` - User profile information
- `products` - Product catalog
- `cart_items` - Shopping cart items
- `orders` - Order information
- `order_items` - Individual items in orders
- `style_preferences` - User style preferences

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Images from Pexels for product photography
- Supabase for backend infrastructure
- Tailwind CSS for styling system
- React ecosystem for frontend framework