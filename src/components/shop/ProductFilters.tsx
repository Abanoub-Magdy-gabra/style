import { X, Sliders } from 'lucide-react';
import { useSearch } from '../../contexts/SearchContext';

const categories = [
  { id: 'women', name: 'Women' },
  { id: 'men', name: 'Men' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'footwear', name: 'Footwear' },
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const colors = [
  { id: 'black', name: 'Black', value: 'bg-gray-900' },
  { id: 'white', name: 'White', value: 'bg-white border' },
  { id: 'gray', name: 'Gray', value: 'bg-gray-400' },
  { id: 'red', name: 'Red', value: 'bg-red-600' },
  { id: 'blue', name: 'Blue', value: 'bg-blue-600' },
  { id: 'green', name: 'Green', value: 'bg-green-600' },
];

const ProductFilters = () => {
  const { filters, setFilters, clearFilters } = useSearch();

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }));
  };

  const toggleSize = (size: string) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const toggleColor = (color: string) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handlePriceChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
  };

  const handleSortChange = (sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest') => {
    setFilters(prev => ({
      ...prev,
      sortBy
    }));
  };

  const hasActiveFilters = 
    filters.category.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 1000;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center">
          <Sliders className="w-5 h-5 mr-2" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-800"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.category.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="font-medium mb-3">Sizes</h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`w-10 h-10 flex items-center justify-center border rounded-md text-sm font-medium transition-colors ${
                filters.sizes.includes(size)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="font-medium mb-3">Colors</h4>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color.id}
              type="button"
              onClick={() => toggleColor(color.id)}
              className={`w-8 h-8 rounded-full ${color.value} flex items-center justify-center ${
                filters.colors.includes(color.id)
                  ? 'ring-2 ring-offset-2 ring-primary-500'
                  : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-300'
              }`}
              title={color.name}
            >
              {filters.colors.includes(color.id) && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label htmlFor="min-price" className="block text-sm text-gray-600 mb-1">
                Min
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="min-price"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange[1])}
                  className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  min="0"
                />
              </div>
            </div>
            <div className="flex-1">
              <label htmlFor="max-price" className="block text-sm text-gray-600 mb-1">
                Max
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="max-price"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(filters.priceRange[0], Number(e.target.value))}
                  className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  min={filters.priceRange[0]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sort */}
      <div>
        <h4 className="font-medium mb-3">Sort By</h4>
        <div className="space-y-2">
          {[
            { id: 'featured', label: 'Featured' },
            { id: 'newest', label: 'Newest' },
            { id: 'price-asc', label: 'Price: Low to High' },
            { id: 'price-desc', label: 'Price: High to Low' },
          ].map((option) => (
            <div key={option.id} className="flex items-center">
              <input
                id={`sort-${option.id}`}
                name="sort"
                type="radio"
                checked={filters.sortBy === option.id}
                onChange={() => handleSortChange(option.id as any)}
                className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <label
                htmlFor={`sort-${option.id}`}
                className="ml-3 block text-sm text-gray-700"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
