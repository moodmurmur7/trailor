/*
  # Initial Schema for Royal Tailors Platform

  1. New Tables
    - `customers` - Store customer information and measurements
    - `fabrics` - Fabric catalog with pricing and stock
    - `garments` - Garment types and base pricing
    - `orders` - Customer orders with tracking and customization

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and admin access
    - Separate policies for customer and admin operations

  3. Features
    - JSON fields for flexible customization and measurement storage
    - Tracking ID generation for order tracking
    - Status tracking for order progress
    - Stock management for fabrics
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  measurements_json jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fabrics table
CREATE TABLE IF NOT EXISTS fabrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  material text NOT NULL,
  price_per_meter numeric NOT NULL DEFAULT 0,
  color text NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  images_json jsonb DEFAULT '[]',
  featured boolean DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create garments table
CREATE TABLE IF NOT EXISTS garments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  base_price numeric NOT NULL DEFAULT 0,
  description text,
  image_url text,
  customization_options jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  fabric_id uuid REFERENCES fabrics(id),
  garment_id uuid REFERENCES garments(id),
  tracking_id text UNIQUE NOT NULL,
  customizations_json jsonb DEFAULT '{}',
  measurements_json jsonb DEFAULT '{}',
  price numeric NOT NULL DEFAULT 0,
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'fabric_ready', 'cutting', 'stitching', 'embroidery', 'quality_check', 'ready', 'completed')),
  urgent boolean DEFAULT false,
  special_instructions text,
  estimated_completion date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create function to generate tracking ID
CREATE OR REPLACE FUNCTION generate_tracking_id()
RETURNS text AS $$
DECLARE
  year_suffix text;
  sequence_num integer;
  tracking_id text;
BEGIN
  year_suffix := EXTRACT(year FROM now())::text;
  
  SELECT COALESCE(MAX(
    CAST(
      SUBSTRING(tracking_id FROM 'RT' || year_suffix || '(\d+)') AS integer
    )
  ), 0) + 1
  INTO sequence_num
  FROM orders
  WHERE tracking_id LIKE 'RT' || year_suffix || '%';
  
  tracking_id := 'RT' || year_suffix || LPAD(sequence_num::text, 3, '0');
  
  RETURN tracking_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate tracking ID
CREATE OR REPLACE FUNCTION set_tracking_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.tracking_id IS NULL OR NEW.tracking_id = '' THEN
    NEW.tracking_id := generate_tracking_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_tracking_id_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_tracking_id();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER customers_updated_at_trigger
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER fabrics_updated_at_trigger
  BEFORE UPDATE ON fabrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER garments_updated_at_trigger
  BEFORE UPDATE ON garments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER orders_updated_at_trigger
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE garments ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customers table
CREATE POLICY "Customers can view their own data"
  ON customers FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all customers"
  ON customers FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Anyone can insert customer data"
  ON customers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for fabrics table
CREATE POLICY "Anyone can view fabrics"
  ON fabrics FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage fabrics"
  ON fabrics FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for garments table
CREATE POLICY "Anyone can view garments"
  ON garments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage garments"
  ON garments FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for orders table
CREATE POLICY "Customers can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Anyone can track orders by tracking_id"
  ON orders FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Customers can create orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Insert sample data
INSERT INTO fabrics (name, material, price_per_meter, color, stock, images_json, featured, description) VALUES
('Premium Silk', 'Silk', 2500, 'Golden', 50, '["https://images.pexels.com/photos/6069107/pexels-photo-6069107.jpeg"]', true, 'Luxurious silk fabric perfect for special occasions'),
('Italian Wool', 'Wool', 3200, 'Navy Blue', 30, '["https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg"]', true, 'Premium wool imported from Italy'),
('Egyptian Cotton', 'Cotton', 1800, 'White', 100, '["https://images.pexels.com/photos/6069102/pexels-photo-6069102.jpeg"]', true, 'Finest Egyptian cotton for ultimate comfort'),
('Royal Velvet', 'Velvet', 4500, 'Deep Purple', 20, '["https://images.pexels.com/photos/6069107/pexels-photo-6069107.jpeg"]', false, 'Rich velvet fabric for luxury garments'),
('Linen Blend', 'Linen', 1500, 'Natural', 75, '["https://images.pexels.com/photos/6069102/pexels-photo-6069102.jpeg"]', false, 'Breathable linen blend for summer wear');

INSERT INTO garments (name, category, base_price, description, image_url) VALUES
('Classic Shirt', 'Shirts', 1200, 'Timeless dress shirt with customizable options', 'https://images.pexels.com/photos/6069107/pexels-photo-6069107.jpeg'),
('Business Suit', 'Suits', 8500, 'Professional two-piece suit', 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg'),
('Wedding Sherwani', 'Traditional', 12000, 'Elegant traditional wear for special occasions', 'https://images.pexels.com/photos/6069107/pexels-photo-6069107.jpeg'),
('Kurta', 'Traditional', 2500, 'Comfortable traditional kurta', 'https://images.pexels.com/photos/6069102/pexels-photo-6069102.jpeg'),
('Saree Blouse', 'Women', 1800, 'Custom-fitted saree blouse', 'https://images.pexels.com/photos/6069107/pexels-photo-6069107.jpeg'),
('Casual Dress', 'Women', 3500, 'Elegant casual dress', 'https://images.pexels.com/photos/6069102/pexels-photo-6069102.jpeg');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_tracking_id ON orders(tracking_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_fabrics_featured ON fabrics(featured);
CREATE INDEX IF NOT EXISTS idx_garments_category ON garments(category);