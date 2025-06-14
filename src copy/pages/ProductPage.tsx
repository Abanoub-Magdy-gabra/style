import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { Heart, ShoppingBag, Truck, Shield, RefreshCw, Ruler, Share2 } from 'lucide-react';
import SustainabilityScore from '../components/product/SustainabilityScore';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import SizeGuide from '../components/product/SizeGuide';
import useSizeGuide from '../hooks/useSizeGuide';
import SocialShare from '../components/common/SocialShare';

const ProductPage = () => {
  const { id } = useParams();
  const { product, isLoading, error } = useProduct(id || '');
  const { addToCart } = useCart();
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const { isOpen, openSizeGuide, closeSizeGuide } = useSizeGuide();

  // Set main image when product loads
  useState(() => {
    if (product && product.images.length > 0) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }
    
    await addToCart(product, 1, selectedSize, selectedColor);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square rounded-lg bg-gray-200 animate-pulse"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square rounded-md bg-gray-200 animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
            <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-medium mb-4">Product not found</h1>
        <p className="text-neutral-600">{error || "The product you're looking for doesn't exist."}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100">
            <img
              src={mainImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setMainImage(image)}
                className={`aspect-square rounded-md overflow-hidden bg-neutral-100 ${
                  mainImage === image ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-serif font-bold mb-2">{product.name}</h1>
            <p className="text-neutral-600 mb-4">{product.brand}</p>
            <div className="flex items-center space-x-4 mb-4">
              {product.salePrice ? (
                <>
                  <span className="text-2xl font-medium text-red-600">${product.salePrice}</span>
                  <span className="text-xl text-neutral-400 line-through">${product.price}</span>
                </>
              ) : (
                <span className="text-2xl font-medium">${product.price}</span>
              )}
            </div>
            <p className="text-neutral-700">{product.description}</p>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Select Size</h3>
              <button 
                onClick={openSizeGuide}
                className="text-sm text-primary-600 hover:underline flex items-center"
                type="button"
              >
                <Ruler className="w-4 h-4 mr-1" />
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 border rounded-md ${
                    selectedSize === size
                      ? 'border-primary-600 bg-primary-50 text-primary-600'
                      : 'border-neutral-200 hover:border-primary-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Select Color</h3>
            <div className="grid grid-cols-4 gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`py-2 border rounded-md ${
                    selectedColor === color
                      ? 'border-primary-600 bg-primary-50 text-primary-600'
                      : 'border-neutral-200 hover:border-primary-600'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-8 relative">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-3 border border-neutral-200 rounded-md hover:border-primary-600"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-600'
                  }`}
                />
              </button>
              <button
                onClick={() => setShowShare(!showShare)}
                className={`p-3 border rounded-md ${
                  showShare 
                    ? 'border-primary-600 bg-primary-50 text-primary-600' 
                    : 'border-neutral-200 hover:border-primary-600'
                }`}
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            {showShare && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 z-10 border border-gray-200">
                <SocialShare 
                  url={window.location.href}
                  title={product.name}
                  description={product.description}
                  image={product.images[0]}
                />
              </div>
            )}
          </div>

          {/* Sustainability Score */}
          <div className="bg-neutral-50 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-4">
              <SustainabilityScore score={product.sustainabilityScore} size="medium" />
              <div>
                <h3 className="font-medium mb-2">Sustainability Details</h3>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li>• Materials: {product.sustainabilityDetails?.materials}</li>
                  <li>• Production: {product.sustainabilityDetails?.production}</li>
                  <li>• Packaging: {product.sustainabilityDetails?.packaging}</li>
                  <li>• Carbon Footprint: {product.sustainabilityDetails?.carbonFootprint}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Shipping & Returns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Truck className="w-5 h-5 text-primary-600" />
              <div>
                <h4 className="font-medium">Free Shipping</h4>
                <p className="text-sm text-neutral-600">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-primary-600" />
              <div>
                <h4 className="font-medium">Secure Payment</h4>
                <p className="text-sm text-neutral-600">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <RefreshCw className="w-5 h-5 text-primary-600" />
              <div>
                <h4 className="font-medium">Easy Returns</h4>
                <p className="text-sm text-neutral-600">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SizeGuide isOpen={isOpen} onClose={closeSizeGuide} />
    </div>
  );
};

export default ProductPage;