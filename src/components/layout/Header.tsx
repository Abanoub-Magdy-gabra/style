import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, User, ShoppingBag, Menu, X, 
  Leaf, Heart, Globe, Gift
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import NavLink from './NavLink';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center"
          >
            <Leaf className="w-6 h-6 text-primary-600 mr-2" />
            <span className="font-serif font-bold text-2xl bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
              stylesphere
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/sustainability">Sustainability</NavLink>
            <NavLink to="/blog">Blog</NavLink>
            <NavLink to="/gift-cards" className="flex items-center">
              <Gift className="h-4 w-4 mr-2" />
              <span>Gift Cards</span>
            </NavLink>
          </nav>

          {/* Desktop Action Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="icon-btn">
              <Search className="icon" />
            </button>
            <Link to="/profile" className="icon-btn">
              <User className="icon" />
            </Link>
            <Link to="/cart" className="icon-btn relative">
              <ShoppingBag className="icon" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden icon-btn" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="icon" /> : <Menu className="icon" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col space-y-6">
            <Link 
              to="/" 
              className="flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Leaf className="w-6 h-6 text-primary-600 mr-2" />
              <span className="font-serif font-bold text-2xl bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
                StyleSphere
              </span>
            </Link>
            
            <div className="flex items-center justify-center space-x-4">
              <button className="icon-btn">
                <Search className="icon" />
              </button>
              <Link to="/profile" className="icon-btn">
                <User className="icon" />
              </Link>
              <Link to="/cart" className="icon-btn relative">
                <ShoppingBag className="icon" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              <ThemeToggle />
            </div>
            
            <nav className="flex flex-col space-y-4">
              <NavLink to="/" mobile>Home</NavLink>
              <NavLink to="/shop" mobile>Shop</NavLink>
              <NavLink to="/sustainability" mobile>Sustainability</NavLink>
              <NavLink to="/blog" mobile>Blog</NavLink>
              <NavLink to="/gift-cards" mobile className="flex items-center">
                <Gift className="w-5 h-5 mr-2" />
                <span>Gift Cards</span>
              </NavLink>
            </nav>
            
            <div className="pt-6 border-t border-neutral-200">
              <div className="flex flex-col space-y-4">
                <Link to="/impact" className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors">
                  <Globe className="w-5 h-5" />
                  <span>Our Impact</span>
                </Link>
                <Link to="/wishlist" className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;