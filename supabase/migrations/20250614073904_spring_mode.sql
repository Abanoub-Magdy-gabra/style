/*
  # Seed Products Data

  1. Insert sample products into the products table
  2. These are the same products from the mock data but stored in Supabase
*/

INSERT INTO products (
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
) VALUES 
(
  'p1',
  'Organic Cotton T-Shirt',
  'EcoWear',
  'Classic t-shirt made from 100% organic cotton. Soft, breathable, and eco-friendly.',
  29.99,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/6612371/pexels-photo-6612371.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'tops',
  85,
  '{
    "materials": "Organic cotton, GOTS certified",
    "production": "Fair Trade certified facility",
    "packaging": "Recycled and biodegradable materials",
    "carbonFootprint": "2.5kg CO2e (60% less than conventional)"
  }'::jsonb,
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['White', 'Black', 'Navy', 'Sage'],
  true,
  false,
  ARRAY['organic', 'basics', 'sustainable']
),
(
  'p2',
  'Recycled Denim Jeans',
  'ReNew Denim',
  'Stylish jeans made from 80% recycled denim and 20% organic cotton. Features a classic five-pocket design.',
  89.99,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/4210863/pexels-photo-4210863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/7691168/pexels-photo-7691168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'bottoms',
  78,
  '{
    "materials": "80% recycled denim, 20% organic cotton",
    "production": "Water-saving production process",
    "packaging": "Plastic-free packaging",
    "carbonFootprint": "5.8kg CO2e (40% less than conventional)"
  }'::jsonb,
  ARRAY['24', '26', '28', '30', '32', '34'],
  ARRAY['Light Wash', 'Medium Wash', 'Dark Wash'],
  false,
  true,
  ARRAY['recycled', 'denim', 'sustainable']
),
(
  'p3',
  'Hemp Blend Blazer',
  'GreenLine',
  'Sophisticated blazer made from a blend of hemp and organic cotton. Perfect for both casual and formal occasions.',
  149.99,
  119.99,
  ARRAY[
    'https://images.pexels.com/photos/2955375/pexels-photo-2955375.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'outerwear',
  90,
  '{
    "materials": "55% hemp, 45% organic cotton",
    "production": "Small-batch production in worker-owned facility",
    "packaging": "Plastic-free, compostable packaging",
    "carbonFootprint": "4.2kg CO2e (70% less than conventional)"
  }'::jsonb,
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Beige', 'Black', 'Olive'],
  false,
  false,
  ARRAY['hemp', 'formal', 'sustainable', 'premium']
),
(
  'p4',
  'Bamboo Lyocell Dress',
  'Bamboo Basics',
  'Elegant midi dress made from bamboo lyocell. Silky soft, breathable, and eco-friendly.',
  79.99,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/6311600/pexels-photo-6311600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'dresses',
  82,
  '{
    "materials": "100% bamboo lyocell",
    "production": "Closed-loop production process",
    "packaging": "Recycled cardboard and paper",
    "carbonFootprint": "3.1kg CO2e (50% less than conventional)"
  }'::jsonb,
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Navy', 'Forest Green', 'Terracotta'],
  true,
  false,
  ARRAY['bamboo', 'elegant', 'sustainable']
),
(
  'p5',
  'Recycled Polyester Puffer Jacket',
  'EcoAlpine',
  'Warm and stylish puffer jacket made from 100% recycled polyester from plastic bottles. Features a water-resistant outer shell.',
  199.99,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/7691053/pexels-photo-7691053.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/6770028/pexels-photo-6770028.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'outerwear',
  75,
  '{
    "materials": "100% recycled polyester (from plastic bottles)",
    "production": "PFC-free water repellent treatment",
    "packaging": "Minimal recycled packaging",
    "carbonFootprint": "7.5kg CO2e (30% less than conventional)"
  }'::jsonb,
  ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Black', 'Navy', 'Forest Green'],
  false,
  true,
  ARRAY['recycled', 'outerwear', 'winter']
),
(
  'p6',
  'Handcrafted Cork Handbag',
  'Cork Collective',
  'Elegant handbag made from sustainable cork. Lightweight, durable, and water-resistant.',
  129.99,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/934673/pexels-photo-934673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'accessories',
  95,
  '{
    "materials": "Sustainably harvested cork, organic cotton lining",
    "production": "Handcrafted by artisans with fair wages",
    "packaging": "Plastic-free, reusable packaging",
    "carbonFootprint": "1.2kg CO2e (85% less than conventional leather)"
  }'::jsonb,
  ARRAY['One Size'],
  ARRAY['Natural', 'Black', 'Pink'],
  false,
  false,
  ARRAY['cork', 'accessories', 'vegan', 'handcrafted']
);