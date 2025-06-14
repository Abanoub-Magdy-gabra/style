import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import SustainabilityScore from './SustainabilityScore';
import { Product } from '../../types/product';
import { formatCurrency, convertToEGP } from '../../utils/currencyUtils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  return (
    <Link 
      to={`/product/${product.id}`}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg">
        {/* Product Image */}
        <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Secondary image on hover */}
          {product.images[1] && (
            <img 
              src={product.images[1]}
              alt={`${product.name} - alternate view`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm transition-transform duration-200 hover:scale-110 z-10"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            className={`w-4 h-4 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-400'
            }`} 
          />
        </button>
        
        {/* Sustainability Score */}
        <div className="absolute bottom-3 left-3 z-10">
          <SustainabilityScore score={product.sustainabilityScore} />
        </div>
        
        {/* Quick Add to Cart */}
        <div className={`absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 p-3 transition-transform duration-300 ${
          isHovered ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="mt-3">
        <h3 className="font-medium text-neutral-800 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-neutral-500 text-sm">{product.brand}</p>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-baseline">
            {product.salePrice ? (
              <>
                <span className="font-medium text-red-600">{formatCurrency(convertToEGP(product.salePrice))}</span>
                <span className="text-neutral-400 text-sm line-through ml-2">{formatCurrency(convertToEGP(product.price))}</span>
              </>
            ) : (
              <span className="font-medium">{formatCurrency(convertToEGP(product.price))}</span>
            )}
          </div>
          {product.isNew && (
            <span className="text-xs px-2 py-1 bg-secondary-100 text-secondary-800 rounded">New</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;