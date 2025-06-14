import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Product } from '../types/product';
import { useProducts } from '../hooks/useProducts';

interface SearchContextType {
  searchQuery: string;
  filters: {
    category: string[];
    priceRange: [number, number];
    sizes: string[];
    colors: string[];
    sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest';
  };
  isSearchOpen: boolean;
  searchResults: Product[];
  setSearchQuery: (query: string) => void;
  setFilters: (filters: any) => void;
  toggleSearch: () => void;
  closeSearch: () => void;
  applyFilters: (products: Product[]) => Product[];
  clearFilters: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: [] as string[],
    priceRange: [0, 1000] as [number, number],
    sizes: [] as string[],
    colors: [] as string[],
    sortBy: 'featured' as const,
  });

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => !prev);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const applyFilters = useCallback((products: Product[]) => {
    return products.filter(product => {
      // Apply search query
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply category filter
      const matchesCategory = filters.category.length === 0 || 
        filters.category.includes(product.category);
      
      // Apply price range filter
      const [minPrice, maxPrice] = filters.priceRange;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      
      // Apply size filter
      const matchesSizes = filters.sizes.length === 0 || 
        filters.sizes.some(size => product.sizes.includes(size));
      
      // Apply color filter
      const matchesColors = filters.colors.length === 0 ||
        filters.colors.some(color => product.colors.includes(color));
      
      return matchesSearch && matchesCategory && matchesPrice && matchesSizes && matchesColors;
    }).sort((a, b) => {
      // Apply sorting
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'featured':
        default:
          return (b.rating || 0) - (a.rating || 0);
      }
    });
  }, [searchQuery, filters]);

  const clearFilters = useCallback(() => {
    setFilters({
      category: [],
      priceRange: [0, 1000],
      sizes: [],
      colors: [],
      sortBy: 'featured',
    });
    setSearchQuery('');
  }, []);

  return (
    <SearchContext.Provider 
      value={{
        searchQuery,
        filters,
        isSearchOpen,
        searchResults: [],
        setSearchQuery,
        setFilters,
        toggleSearch,
        closeSearch,
        applyFilters,
        clearFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
