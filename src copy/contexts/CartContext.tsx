import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Product } from '../types/product';
import toast from 'react-hot-toast';

interface CartItem extends Product {
  quantity: number;
  size?: string;
  color?: string;
  cart_item_id?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load cart items when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCartItems();
    } else {
      // Load from localStorage for non-authenticated users
      loadLocalCartItems();
    }
  }, [user, isAuthenticated]);

  const loadCartItems = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data: cartData, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          size,
          color,
          products (
            id,
            name,
            brand,
            description,
            price,
            sale_price,
            images,
            category,
            sustainability_score,
            sustainability_details,
            sizes,
            colors,
            is_new,
            is_bestseller,
            tags
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading cart items:', error);
        return;
      }

      const items: CartItem[] = cartData?.map((item: any) => ({
        ...item.products,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        cart_item_id: item.id,
        sustainabilityDetails: item.products.sustainability_details,
        salePrice: item.products.sale_price,
        isNew: item.products.is_new,
        isBestseller: item.products.is_bestseller,
      })) || [];

      setCartItems(items);
    } catch (error) {
      console.error('Error in loadCartItems:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocalCartItems = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading local cart:', error);
    }
  };

  const saveLocalCartItems = (items: CartItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving local cart:', error);
    }
  };

  const addToCart = async (product: Product, quantity = 1, size?: string, color?: string) => {
    if (!isAuthenticated || !user) {
      // Handle non-authenticated users with localStorage
      const existingItemIndex = cartItems.findIndex(
        item => item.id === product.id && item.size === size && item.color === color
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = cartItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...cartItems, { ...product, quantity, size, color }];
      }

      setCartItems(newItems);
      saveLocalCartItems(newItems);
      toast.success('Added to cart');
      return;
    }

    try {
      setIsLoading(true);

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .eq('size', size || '')
        .eq('color', color || '')
        .single();

      if (existingItem) {
        // Update existing item
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity,
            size: size || null,
            color: color || null,
          });

        if (error) throw error;
      }

      await loadCartItems();
      toast.success('Added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!isAuthenticated || !user) {
      // Handle non-authenticated users
      const newItems = cartItems.filter(item => item.cart_item_id !== cartItemId);
      setCartItems(newItems);
      saveLocalCartItems(newItems);
      toast.success('Removed from cart');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;

      await loadCartItems();
      toast.success('Removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) return;

    if (!isAuthenticated || !user) {
      // Handle non-authenticated users
      const newItems = cartItems.map(item =>
        item.cart_item_id === cartItemId ? { ...item, quantity } : item
      );
      setCartItems(newItems);
      saveLocalCartItems(newItems);
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);

      if (error) throw error;

      await loadCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated || !user) {
      // Handle non-authenticated users
      setCartItems([]);
      localStorage.removeItem('cart');
      toast.success('Cart cleared');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.salePrice || item.price;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};