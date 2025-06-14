import { useState, useCallback } from 'react';

export default function useSizeGuide() {
  const [isOpen, setIsOpen] = useState(false);

  const openSizeGuide = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeSizeGuide = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  }, []);

  return {
    isOpen,
    openSizeGuide,
    closeSizeGuide,
  };
}
