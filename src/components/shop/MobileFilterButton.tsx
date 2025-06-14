import { SlidersHorizontal, X } from 'lucide-react';

interface MobileFilterButtonProps {
  isOpen: boolean;
  onClick: () => void;
  filterCount: number;
}

export const MobileFilterButton = ({ isOpen, onClick, filterCount }: MobileFilterButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-40 flex items-center justify-center p-3 rounded-full 
        bg-primary-600 text-white shadow-lg hover:bg-primary-700 focus:outline-none 
        focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200
        transform hover:scale-105 active:scale-95
        ${isOpen ? 'rotate-180' : 'rotate-0'}
      `}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <>
          <SlidersHorizontal className="w-6 h-6" />
          {filterCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-xs font-medium">
              {filterCount}
            </span>
          )}
        </>
      )}
      <span className="sr-only">
        {isOpen ? 'Close filters' : `Open filters${filterCount > 0 ? ` (${filterCount} active)` : ''}`}
      </span>
    </button>
  );
};

export default MobileFilterButton;
