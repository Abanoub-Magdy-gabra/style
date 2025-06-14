import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Leaf, Sparkles, Shield, Recycle } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { useProducts } from '../hooks/useProducts';
import HeroSlider from '../components/home/HeroSlider';
import SustainabilityScore from '../components/product/SustainabilityScore';
import CategoryCard from '../components/home/CategoryCard';
import AIStyleCard from '../components/home/AIStyleCard';

const HomePage = () => {
  const { products: trendingProducts, isLoading } = useProducts({ featured: true, limit: 4 });
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSlider />

      {/* USP Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Why choose StyleSphere?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg transition-all hover:shadow-md">
              <div className="bg-primary-100 p-4 rounded-full mb-4">
                <Sparkles className="text-primary-600 w-6 h-6" />
              </div>
              <h3 className="font-medium text-xl mb-2">AI-Powered Styling</h3>
              <p className="text-neutral-600">
                Get personalized outfit recommendations based on your style preferences, body type, and the latest trends.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg transition-all hover:shadow-md">
              <div className="bg-primary-100 p-4 rounded-full mb-4">
                <Shield className="text-primary-600 w-6 h-6" />
              </div>
              <h3 className="font-medium text-xl mb-2">Sustainable Fashion</h3>
              <p className="text-neutral-600">
                Every item is scored for sustainability, with transparent information about materials and production methods.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg transition-all hover:shadow-md">
              <div className="bg-primary-100 p-4 rounded-full mb-4">
                <Recycle className="text-primary-600 w-6 h-6" />
              </div>
              <h3 className="font-medium text-xl mb-2">Second Life Marketplace</h3>
              <p className="text-neutral-600">
                Buy, sell, or swap pre-loved fashion items to extend their lifecycle and reduce waste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif font-bold">Trending Now</h2>
            <Link to="/shop" className="text-primary-600 hover:text-primary-700 flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI Style Assistant Banner */}
      <section className="py-16 bg-gradient-to-r from-primary-100 to-secondary-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-serif font-bold mb-4">
                Meet Your Personal AI Style Assistant
              </h2>
              <p className="text-neutral-600 mb-6 max-w-md">
                Our AI analyzes your preferences, body type, and current trends to create perfect outfits for any occasion.
              </p>
              <Link 
                to="/style-quiz" 
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
              >
                Take Style Quiz
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            
            <div className="md:w-1/2">
              <AIStyleCard />
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif font-bold mb-8">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CategoryCard 
              title="Women" 
              image="https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              link="/shop?category=women"
            />
            <CategoryCard 
              title="Men" 
              image="https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              link="/shop?category=men"
            />
            <CategoryCard 
              title="Accessories" 
              image="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              link="/shop?category=accessories"
            />
            <CategoryCard 
              title="Sustainable" 
              image="https://images.pexels.com/photos/5699514/pexels-photo-5699514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              link="/shop?category=sustainable"
            />
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <div className="flex items-center mb-4">
                <Leaf className="text-primary-600 w-6 h-6 mr-2" />
                <span className="text-primary-600 font-medium">Sustainable Fashion</span>
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">
                Your Style Shouldn't Cost the Earth
              </h2>
              <p className="text-neutral-600 mb-6">
                Every product on StyleSphere is rated for sustainability. We analyze materials, production methods, 
                worker conditions, and carbon footprint to give you complete transparency.
              </p>
              <Link 
                to="/sustainability" 
                className="inline-flex items-center px-6 py-3 border-2 border-primary-600 text-primary-600 font-medium rounded-md hover:bg-primary-50 transition-colors"
              >
                Learn More
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            
            <div className="md:w-1/2 bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <SustainabilityScore score={85} size="large" />
                <h3 className="text-xl font-medium mt-4 mb-2">What our scores mean</h3>
                <p className="text-neutral-600 mb-6">
                  Our sustainability score considers multiple factors:
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Leaf className="text-green-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">Materials</h4>
                    <p className="text-sm text-neutral-600">Organic, recycled, or innovative sustainable materials</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Shield className="text-blue-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">Production</h4>
                    <p className="text-sm text-neutral-600">Low-impact manufacturing and ethical labor practices</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <Recycle className="text-yellow-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">Lifecycle</h4>
                    <p className="text-sm text-neutral-600">Durability, recyclability, and end-of-life options</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;