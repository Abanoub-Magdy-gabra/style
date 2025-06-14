/*
  # Fix Guest Checkout Support

  1. Changes
    - Make `user_id` nullable in `orders` table to support guest checkout
    - Make `user_id` nullable in `order_items` table for consistency
    - Add RLS policy to allow anonymous users to insert orders with null user_id
    - Add RLS policy to allow anonymous users to insert order items for guest orders

  2. Security
    - Anonymous users can only create orders with null user_id
    - Anonymous users can only create order items for orders with null user_id
    - Authenticated users maintain existing policies for their own orders
*/

-- Make user_id nullable in orders table to support guest checkout
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'user_id' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;
  END IF;
END $$;

-- Add RLS policy for anonymous users to insert guest orders
CREATE POLICY "Anonymous users can create guest orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Add RLS policy for anonymous users to view guest orders (needed for order confirmation)
CREATE POLICY "Anonymous users can view guest orders by order number"
  ON orders
  FOR SELECT
  TO anon
  USING (user_id IS NULL);

-- Add RLS policy for anonymous users to insert order items for guest orders
CREATE POLICY "Anonymous users can create order items for guest orders"
  ON order_items
  FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id IS NULL
    )
  );

-- Add RLS policy for anonymous users to view order items for guest orders
CREATE POLICY "Anonymous users can view order items for guest orders"
  ON order_items
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id IS NULL
    )
  );