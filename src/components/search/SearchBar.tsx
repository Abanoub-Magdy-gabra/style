import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '../../contexts/SearchContext';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    isSearchOpen, 
    closeSearch, 
    toggleSearch 
  } = useSearch();
  
  const [inputValue, setInputValue] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Update local state when searchQuery changes
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Focus input when search is opened
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchQuery(inputValue.trim());
      navigate('/shop');
      closeSearch();
    }
  };

  const handleClear = () => {
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (!isSearchOpen) {
    return (
      <button 
        onClick={toggleSearch}
        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="absolute inset-0 bg-white z-50 flex items-center px-4">
      <div className="relative w-full">
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for products..."
            className="w-full py-3 pl-10 pr-12 text-gray-900 border-0 focus:ring-2 focus:ring-primary-500 rounded-md bg-gray-50"
            autoComplete="off"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-10 flex items-center"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
          <button
            type="button"
            onClick={closeSearch}
            className="absolute inset-y-0 right-0 px-4 flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
