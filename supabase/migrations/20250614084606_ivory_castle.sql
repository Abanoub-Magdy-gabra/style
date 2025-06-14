/*
  # Fix Product UUIDs and Add More Products

  1. Insert products with proper UUID format
  2. Add diverse product catalog with correct data types
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
-- Women's Tops
(
  gen_random_uuid(),
  'Organic Linen Blouse',
  'Pure Earth',
  'Elegant blouse made from 100% organic linen. Perfect for both casual and professional settings.',
  69.99,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'tops',
  88,
  '{
    "materials": "100% organic linen, GOTS certified",
    "production": "Made in fair trade certified facility",
    "packaging": "Plastic-free, compostable packaging",
    "carbonFootprint": "2.1kg CO2e (65% less than conventional)"
  }'::jsonb,
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['White', 'Cream', 'Sage', 'Dusty Pink'],
  true,
  false,
  ARRAY['organic', 'linen', 'professional', 'sustainable']
),
(
  gen_random_uuid(),
  'Recycled Cashmere Sweater',
  'ReKnit',
  'Luxurious sweater made from 100% recycled cashmere. Soft, warm, and environmentally conscious.',
  159.99,
  129.99,
  ARRAY[
    'https://images.pexels.com/photos/7691168/pexels-photo-7691168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'tops',
  92,
  '{
    "materials": "100% recycled cashmere",
    "production": "Circular fashion process, zero waste",
    "packaging": "Reusable organic cotton bag",
    "carbonFootprint": "3.8kg CO2e (80% less than new cashmere)"
  }'::jsonb,
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Charcoal', 'Cream', 'Camel', 'Navy'],
  false,
  true,
  ARRAY['recycled', 'luxury', 'cashmere', 'premium']
),

-- Women's Dresses
(
  gen_random_uuid(),
  'Tencel Wrap Dress',
  'Flow Collective',
  'Versatile wrap dress made from sustainable Tencel fabric. Breathable, moisture-wicking, and biodegradable.',
  89.99,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/6311600/pexels-photo-6311600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/6567607/pexels-photo-6567607.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'dresses',
  85,
  '{
    "materials": "100% Tencel lyocell from sustainably sourced wood",
    "production": "Closed-loop production with 99% solvent recovery",
    "packaging": "Biodegradable packaging",
    "carbonFootprint": "2.8kg CO2e (55% less than conventional)"
  }'::jsonb,
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Black', 'Navy', 'Emerald', 'Rust'],
  true,
  false,
  ARRAY['tencel', 'versatile', 'sustainable', 'comfortable']
),
(
  gen_random_uuid(),
  'Upcycled Vintage Denim Dress',
  'Second Life',
  'Unique dress created from upcycled vintage denim. Each piece is one-of-a-kind with its own character.',
  119.99,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/4210863/pexels-photo-4210863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/7691168/pexels-photo-7691168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'dresses',
  95,
  '{
    "materials": "100% upcycled vintage denim",
    "production": "Handcrafted by local artisans",
    "packaging": "Reusable vintage-style bag",
    "carbonFootprint": "0.8kg CO2e (90% less than new production)"
  }'::jsonb,
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Light Wash', 'Medium Wash', 'Dark Wash'],
  false,
  false,
  ARRAY['upcycled', 'vintage', 'unique', 'handcrafted']
),

-- Men's Collection
(
  gen_random_uuid(),
  'Organic Cotton Polo',
  'Green Gentleman',
  'Classic polo shirt made from 100% organic cotton. Perfect for casual and smart-casual occasions.',
  49.99,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/2955375/pexels-photo-2955375.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'men',
  83,
  '{
    "materials": "100% organic cotton, GOTS certified",
    "production": "Fair trade manufacturing",
    "packaging": "Plastic-free packaging",
    "carbonFootprint": "2.3kg CO2e (60% less than conventional)"
  }'::jsonb,
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['White', 'Navy', 'Forest Green', 'Burgundy'],
  false,
  true,
  ARRAY['organic', 'men', 'polo', 'classic']
),
(
  gen_random_uuid(),
  'Hemp Chino Pants',
  'Earth Threads',
  'Comfortable chino pants made from hemp and organic cotton blend. Durable, breathable, and naturally antimicrobial.',
  79.99,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/7691053/pexels-photo-7691053.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/6770028/pexels-photo-6770028.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'men',
  87,
  '{
    "materials": "55% hemp, 45% organic cotton",
    "production": "Low-impact dyeing process",
    "packaging": "Compostable packaging",
    "carbonFootprint": "3.2kg CO2e (70% less than conventional)"
  }'::jsonb,
  ARRAY['28', '30', '32', '34', '36', '38'],
  ARRAY['Khaki', 'Navy', 'Olive', 'Stone'],
  true,
  false,
  ARRAY['hemp', 'men', 'chinos', 'durable']
),

-- Accessories
(
  gen_random_uuid(),
  'Recycled Ocean Plastic Sunglasses',
  'Sea Change',
  'Stylish sunglasses made from recycled ocean plastic. UV protection with a clear conscience.',
  89.99,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/934673/pexels-photo-934673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'accessories',
  90,
  '{
    "materials": "100% recycled ocean plastic",
    "production": "Each pair removes 5 plastic bottles from ocean",
    "packaging": "Recycled cardboard case",
    "carbonFootprint": "1.5kg CO2e (75% less than conventional)"
  }'::jsonb,
  ARRAY['One Size'],
  ARRAY['Black', 'Tortoise', 'Blue', 'Clear'],
  false,
  false,
  ARRAY['recycled', 'ocean', 'sunglasses', 'accessories']
),
(
  gen_random_uuid(),
  'Organic Cotton Canvas Tote',
  'Carry Forward',
  'Spacious tote bag made from organic cotton canvas. Perfect for shopping, work, or everyday use.',
  24.99,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/934673/pexels-photo-934673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'accessories',
  80,
  '{
    "materials": "100% organic cotton canvas",
    "production": "Screen printed with water-based inks",
    "packaging": "No packaging - ships as is",
    "carbonFootprint": "0.9kg CO2e (65% less than conventional)"
  }'::jsonb,
  ARRAY['One Size'],
  ARRAY['Natural', 'Black', 'Navy', 'Forest Green'],
  true,
  false,
  ARRAY['organic', 'tote', 'canvas', 'everyday']
),

-- Footwear
(
  gen_random_uuid(),
  'Recycled Rubber Sneakers',
  'Step Forward',
  'Comfortable sneakers made from recycled rubber and organic cotton. Perfect for everyday wear.',
  109.99,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/934673/pexels-photo-934673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'footwear',
  82,
  '{
    "materials": "Recycled rubber sole, organic cotton upper",
    "production": "Vulcanized construction for durability",
    "packaging": "Recycled shoe box",
    "carbonFootprint": "4.1kg CO2e (50% less than conventional)"
  }'::jsonb,
  ARRAY['6', '7', '8', '9', '10', '11', '12'],
  ARRAY['White', 'Black', 'Gray', 'Navy'],
  false,
  true,
  ARRAY['recycled', 'sneakers', 'comfortable', 'everyday']
),

-- Outerwear
(
  gen_random_uuid(),
  'Recycled Wool Peacoat',
  'Winter Circle',
  'Classic peacoat made from 100% recycled wool. Warm, stylish, and environmentally responsible.',
  249.99,
  199.99,
  ARRAY[
    'https://images.pexels.com/photos/7691053/pexels-photo-7691053.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/6770028/pexels-photo-6770028.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'outerwear',
  89,
  '{
    "materials": "100% recycled wool",
    "production": "Traditional tailoring techniques",
    "packaging": "Garment bag made from recycled materials",
    "carbonFootprint": "6.2kg CO2e (70% less than new wool)"
  }'::jsonb,
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Navy', 'Charcoal', 'Camel'],
  false,
  false,
  ARRAY['recycled', 'wool', 'peacoat', 'winter']
),

-- Activewear
(
  gen_random_uuid(),
  'Recycled Polyester Sports Bra',
  'Active Earth',
  'High-performance sports bra made from recycled polyester. Moisture-wicking and supportive.',
  39.99,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'activewear',
  78,
  '{
    "materials": "85% recycled polyester, 15% elastane",
    "production": "Seamless construction for comfort",
    "packaging": "Minimal recycled packaging",
    "carbonFootprint": "1.8kg CO2e (45% less than conventional)"
  }'::jsonb,
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Black', 'Navy', 'Forest Green', 'Dusty Rose'],
  true,
  false,
  ARRAY['recycled', 'activewear', 'sports', 'performance']
),
(
  gen_random_uuid(),
  'Organic Cotton Yoga Pants',
  'Mindful Movement',
  'Comfortable yoga pants made from organic cotton and elastane blend. Perfect for yoga, pilates, or lounging.',
  59.99,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/4210863/pexels-photo-4210863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/7691168/pexels-photo-7691168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'activewear',
  84,
  '{
    "materials": "95% organic cotton, 5% elastane",
    "production": "Low-impact dyeing process",
    "packaging": "Compostable packaging",
    "carbonFootprint": "2.5kg CO2e (60% less than conventional)"
  }'::jsonb,
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Black', 'Charcoal', 'Navy', 'Sage'],
  false,
  true,
  ARRAY['organic', 'yoga', 'activewear', 'comfortable']
),

-- Jewelry & Accessories
(
  gen_random_uuid(),
  'Recycled Silver Minimalist Ring',
  'Pure Elements',
  'Elegant minimalist ring made from 100% recycled silver. Timeless design with ethical sourcing.',
  79.99,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/934673/pexels-photo-934673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'jewelry',
  93,
  '{
    "materials": "100% recycled sterling silver",
    "production": "Handcrafted by certified artisans",
    "packaging": "Recycled jewelry box",
    "carbonFootprint": "0.3kg CO2e (85% less than mined silver)"
  }'::jsonb,
  ARRAY['5', '6', '7', '8', '9'],
  ARRAY['Silver'],
  false,
  false,
  ARRAY['recycled', 'silver', 'jewelry', 'minimalist']
),
(
  gen_random_uuid(),
  'Sustainable Bamboo Watch',
  'Time & Nature',
  'Unique watch made from sustainably sourced bamboo with a recycled steel movement.',
  149.99,
  NULL,
  ARRAY[
    'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/934673/pexels-photo-934673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'accessories',
  88,
  '{
    "materials": "Sustainably sourced bamboo, recycled steel movement",
    "production": "Handcrafted with traditional techniques",
    "packaging": "Bamboo gift box",
    "carbonFootprint": "2.1kg CO2e (70% less than conventional watches)"
  }'::jsonb,
  ARRAY['One Size'],
  ARRAY['Natural', 'Dark Brown'],
  true,
  false,
  ARRAY['bamboo', 'watch', 'sustainable', 'handcrafted']
);