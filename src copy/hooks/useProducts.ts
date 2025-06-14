import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types/product';

interface UseProductsOptions {
  category?: string;
  featured?: boolean;
  limit?: number;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [options.category, options.featured, options.limit]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase.from('products').select('*');

      if (options.category) {
        query = query.eq('category', options.category);
      }

      if (options.featured) {
        query = query.eq('is_bestseller', true);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      const formattedProducts: Product[] = data?.map((product: any) => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        description: product.description,
        price: product.price,
        salePrice: product.sale_price,
        images: product.images,
        category: product.category,
        sustainabilityScore: product.sustainability_score,
        sustainabilityDetails: product.sustainability_details,
        sizes: product.sizes,
        colors: product.colors,
        isNew: product.is_new,
        isBestseller: product.is_bestseller,
        tags: product.tags,
      })) || [];

      setProducts(formattedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  return { products, isLoading, error, refetch: fetchProducts };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        const formattedProduct: Product = {
          id: data.id,
          name: data.name,
          brand: data.brand,
          description: data.description,
          price: data.price,
          salePrice: data.sale_price,
          images: data.images,
          category: data.category,
          sustainabilityScore: data.sustainability_score,
          sustainabilityDetails: data.sustainability_details,
          sizes: data.sizes,
          colors: data.colors,
          isNew: data.is_new,
          isBestseller: data.is_bestseller,
          tags: data.tags,
        };

        setProduct(formattedProduct);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
    } finally {
      setIsLoading(false);
    }
  };

  return { product, isLoading, error, refetch: fetchProduct };
};