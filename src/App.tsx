import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Chatbot from './components/common/Chatbot';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import SustainabilityPage from './pages/SustainabilityPage';
import ProfilePage from './pages/ProfilePage';
import BlogHomePage from './pages/BlogHomePage';
import BlogPage from './pages/BlogPage';
import GiftCardsPage from './pages/GiftCardsPage';
import GiftCardPurchasePage from './pages/GiftCardPurchasePage';
import GiftCardRedeemPage from './pages/GiftCardRedeemPage';
import CartPage from './pages/CartPage';
import StyleQuizPage from './pages/StyleQuizPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CheckoutPage from './pages/CheckoutPage';
import CheckoutConfirmationPage from './pages/CheckoutConfirmationPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { StyleProvider } from './contexts/StyleContext';
import { SearchProvider } from './contexts/SearchContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <StyleProvider>
          <SearchProvider>
            <div className="min-h-screen flex flex-col bg-neutral-50">
              <Toaster 
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#4ade80',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/sustainability" element={<SustainabilityPage />} />
                  <Route path="/blog" element={<BlogHomePage />} />
                  <Route path="/blog/:slug" element={<BlogPage />} />
                  <Route path="/gift-cards" element={<GiftCardsPage />} />
                  <Route path="/gift-cards/purchase" element={<GiftCardPurchasePage />} />
                  <Route path="/gift-cards/redeem" element={<GiftCardRedeemPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/style-quiz" element={<StyleQuizPage />} />
                  
                  {/* Auth Routes */}
                  <Route path="/login" element={
                    <ProtectedRoute requireAuth={false}>
                      <LoginPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/register" element={
                    <ProtectedRoute requireAuth={false}>
                      <RegisterPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  
                  {/* Protected Routes */}
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders/:orderId" element={
                    <ProtectedRoute>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Checkout Routes */}
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/checkout/confirmation" element={<CheckoutConfirmationPage />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                </Routes>
              </main>
              <Footer />
              <Chatbot />
            </div>
          </SearchProvider>
        </StyleProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;