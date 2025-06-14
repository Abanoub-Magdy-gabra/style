import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import { X, SlidersHorizontal, Search as SearchIcon } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';
import ProductFilters from '../components/shop/ProductFilters';
import MobileFilterButton from '../components/shop/MobileFilterButton';

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const { searchQuery, filters, setSearchQuery, setFilters } = useSearch();
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  
  // Get category from URL params
  const categoryFromUrl = searchParams.get('category');
  
  // Fetch products from Supabase
  const { products: allProducts, isLoading, error } = useProducts({
    category: categoryFromUrl || undefined
  });

  // Filter products based on search and filters
  const filteredProducts = allProducts.filter((product) => {
    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filter by category
    if (filters.category.length > 0 && !filters.category.includes(product.category)) {
      return false;
    }

    // Filter by price range
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    // Filter by sizes
    if (filters.sizes.length > 0 && product.sizes) {
      const hasMatchingSize = product.sizes.some((size: string) => 
        filters.sizes.includes(size)
      );
      if (!hasMatchingSize) return false;
    }

    // Filter by colors
    if (filters.colors.length > 0 && product.colors) {
      const hasMatchingColor = product.colors.some((color: string) => 
        filters.colors.includes(color)
      );
      if (!hasMatchingColor) return false;
    }

    return true;
  }).sort((a, b) => {
    // Sort products
    switch (filters.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case 'featured':
      default:
        return (b.sustainabilityScore || 0) - (a.sustainabilityScore || 0);
    }
  });

  // Check if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Calculate active filter count
  const activeFilterCount = 
    (searchQuery ? 1 : 0) + 
    filters.category.length + 
    filters.sizes.length + 
    filters.colors.length + 
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0);

  // Update search query from URL on initial load
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      setLocalSearch(query);
    }
  }, [searchParams, setSearchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-serif font-bold">
            {categoryFromUrl ? `${categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1)} Collection` : 'Shop All'}
          </h1>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 text-neutral-600 hover:text-primary-600"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  setSearchQuery('');
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Mobile Filter Button */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-40">
          <MobileFilterButton 
            isOpen={showFilters} 
            onClick={() => setShowFilters(!showFilters)}
            filterCount={activeFilterCount}
          />
        </div>
      )}
      
      {/* Overlay for mobile */}
      {isMobile && showFilters && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={() => setShowFilters(false)}
          aria-hidden="true"
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
        {/* Filters Sidebar */}
        <div 
          className={`
            md:col-span-1 space-y-6 transition-transform duration-300 ease-in-out transform
            ${isMobile 
              ? 'fixed inset-y-0 left-0 w-4/5 bg-white z-40 p-6 overflow-y-auto shadow-lg' 
              : 'relative'}
            ${!showFilters && isMobile ? '-translate-x-full' : 'translate-x-0'}
          `}
        >
          {isMobile && (
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close filters"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          )}
          <div className="space-y-6">
            <ProductFilters />
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          {/* Active filters */}
          {(searchQuery || filters.category.length > 0 || filters.sizes.length > 0 || filters.colors.length > 0 || filters.priceRange[1] < 1000) && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  Search: {searchQuery}
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary-200 hover:bg-primary-300 focus:outline-none"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
              
              {filters.category.map((cat: string) => (
                <span key={cat} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {cat}
                  <button
                    type="button"
                    onClick={() => setFilters((prev: any) => ({
                      ...prev,
                      category: prev.category.filter((c: string) => c !== cat)
                    }))}
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    category: [],
                    sizes: [],
                    colors: [],
                    priceRange: [0, 1000],
                    sortBy: 'featured'
                  });
                }}
                className="ml-2 text-sm text-primary-600 hover:text-primary-800"
              >
                Clear all
              </button>
            </div>
          )}
          
          {/* Loading state */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    category: [],
                    sizes: [],
                    colors: [],
                    priceRange: [0, 1000],
                    sortBy: 'featured'
                  });
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;