import { Link } from 'react-router-dom';
import { Leaf, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <Leaf className="w-6 h-6 text-primary-400 mr-2" />
              <span className="font-serif font-bold text-2xl text-white">stylesphere</span>
            </Link>
            <p className="text-neutral-400 mb-6">
              Redefining fashion with sustainability, technology, and personal style evolution.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium text-white mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/shop/women" className="text-neutral-400 hover:text-white transition-colors">Women</Link></li>
              <li><Link to="/shop/men" className="text-neutral-400 hover:text-white transition-colors">Men</Link></li>
              <li><Link to="/shop/accessories" className="text-neutral-400 hover:text-white transition-colors">Accessories</Link></li>
              <li><Link to="/shop/sustainable" className="text-neutral-400 hover:text-white transition-colors">Sustainable Collection</Link></li>
              <li><Link to="/shop/sale" className="text-neutral-400 hover:text-white transition-colors">Sale</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-neutral-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/sustainability" className="text-neutral-400 hover:text-white transition-colors">Sustainability</Link></li>
              <li><Link to="/careers" className="text-neutral-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/press" className="text-neutral-400 hover:text-white transition-colors">Press</Link></li>
              <li><Link to="/contact" className="text-neutral-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium text-white mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-neutral-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/shipping" className="text-neutral-400 hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/size-guide" className="text-neutral-400 hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link to="/privacy" className="text-neutral-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-neutral-400 hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} StyleSphere. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-neutral-400 hover:text-white text-sm transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-neutral-400 hover:text-white text-sm transition-colors">
              Terms
            </Link>
            <Link to="/accessibility" className="text-neutral-400 hover:text-white text-sm transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;