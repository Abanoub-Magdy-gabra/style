export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: string;
  sustainabilityScore: number;
  sustainabilityDetails?: {
    materials: string;
    production: string;
    packaging: string;
    carbonFootprint: string;
  };
  sizes: string[];
  colors: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  tags: string[];
}