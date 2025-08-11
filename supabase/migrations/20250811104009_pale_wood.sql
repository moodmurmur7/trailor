/*
  # Complete Tailor Shop Database Schema

  1. New Tables
    - `customers` - Customer information and measurements
    - `fabrics` - Fabric inventory with pricing and stock
    - `garments` - Garment types with customization options
    - `orders` - Customer orders with full details
    - `order_items` - Individual items in orders
    - `measurements` - Customer measurements
    - `admin_users` - Admin authentication

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for customers and admins
    - Secure admin access with role-based permissions

  3. Functions
    - Auto-generate tracking IDs
    - Update timestamps automatically
    - Calculate order totals
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed', 
  'fabric_ready',
  'cutting',
  'stitching',
  'embroidery',
  'quality_check',
  'ready',
  'completed',
  'cancelled'
);

CREATE TYPE measurement_method AS ENUM (
  'manual',
  'home_visit',
  'saved',
  'guide'
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  address TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Measurements table
CREATE TABLE IF NOT EXISTS measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  chest DECIMAL(5,2),
  waist DECIMAL(5,2),
  hips DECIMAL(5,2),
  shoulder DECIMAL(5,2),
  sleeve_length DECIMAL(5,2),
  shirt_length DECIMAL(5,2),
  trouser_length DECIMAL(5,2),
  neck DECIMAL(5,2),
  bicep DECIMAL(5,2),
  wrist DECIMAL(5,2),
  thigh DECIMAL(5,2),
  knee DECIMAL(5,2),
  ankle DECIMAL(5,2),
  method measurement_method DEFAULT 'manual',
  measured_by TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fabrics table
CREATE TABLE IF NOT EXISTS fabrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  material TEXT NOT NULL,
  color TEXT NOT NULL,
  pattern TEXT,
  weight TEXT,
  price_per_meter DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock_meters INTEGER NOT NULL DEFAULT 0,
  minimum_stock INTEGER DEFAULT 10,
  supplier TEXT,
  fabric_code TEXT UNIQUE,
  care_instructions TEXT,
  description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garments table
CREATE TABLE IF NOT EXISTS garments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  description TEXT,
  image_url TEXT,
  customization_options JSONB DEFAULT '{}'::jsonb,
  fabric_requirement DECIMAL(5,2) DEFAULT 2.0, -- meters needed
  stitching_time_days INTEGER DEFAULT 7,
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  gender TEXT CHECK (gender IN ('male', 'female', 'unisex')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_id TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  status order_status DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  advance_paid DECIMAL(10,2) DEFAULT 0,
  balance_amount DECIMAL(10,2) DEFAULT 0,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  urgent BOOLEAN DEFAULT FALSE,
  urgent_charges DECIMAL(10,2) DEFAULT 0,
  special_instructions TEXT,
  estimated_completion_date DATE,
  actual_completion_date DATE,
  delivery_method TEXT DEFAULT 'pickup',
  delivery_address TEXT,
  delivery_charges DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  garment_id UUID REFERENCES garments(id) ON DELETE SET NULL,
  fabric_id UUID REFERENCES fabrics(id) ON DELETE SET NULL,
  measurement_id UUID REFERENCES measurements(id) ON DELETE SET NULL,
  quantity INTEGER DEFAULT 1,
  garment_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  fabric_price_per_meter DECIMAL(10,2) NOT NULL DEFAULT 0,
  fabric_meters_used DECIMAL(5,2) NOT NULL DEFAULT 0,
  customizations JSONB DEFAULT '{}'::jsonb,
  item_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'manager', 'staff')),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_id ON orders(tracking_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_fabrics_featured ON fabrics(featured);
CREATE INDEX IF NOT EXISTS idx_fabrics_active ON fabrics(is_active);
CREATE INDEX IF NOT EXISTS idx_garments_category ON garments(category);
CREATE INDEX IF NOT EXISTS idx_garments_active ON garments(is_active);
CREATE INDEX IF NOT EXISTS idx_measurements_customer_id ON measurements(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Function to generate tracking ID
CREATE OR REPLACE FUNCTION generate_tracking_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  exists_check INTEGER;
BEGIN
  LOOP
    new_id := 'RT' || LPAD((EXTRACT(EPOCH FROM NOW())::BIGINT % 1000000)::TEXT, 6, '0');
    SELECT COUNT(*) INTO exists_check FROM orders WHERE tracking_id = new_id;
    EXIT WHEN exists_check = 0;
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate order totals
CREATE OR REPLACE FUNCTION calculate_order_total()
RETURNS TRIGGER AS $$
DECLARE
  order_total DECIMAL(10,2);
BEGIN
  -- Calculate total from order items
  SELECT COALESCE(SUM(item_total), 0) INTO order_total
  FROM order_items 
  WHERE order_id = NEW.order_id;
  
  -- Update order total
  UPDATE orders 
  SET total_amount = order_total + COALESCE(urgent_charges, 0) + COALESCE(delivery_charges, 0) + COALESCE(tax_amount, 0) - COALESCE(discount_amount, 0),
      balance_amount = order_total + COALESCE(urgent_charges, 0) + COALESCE(delivery_charges, 0) + COALESCE(tax_amount, 0) - COALESCE(discount_amount, 0) - COALESCE(advance_paid, 0)
  WHERE id = NEW.order_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER set_tracking_id_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.tracking_id IS NULL OR NEW.tracking_id = '')
  EXECUTE FUNCTION (
    CREATE OR REPLACE FUNCTION set_tracking_id()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.tracking_id = generate_tracking_id();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  );

CREATE TRIGGER customers_updated_at_trigger
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER measurements_updated_at_trigger
  BEFORE UPDATE ON measurements
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

CREATE TRIGGER order_items_updated_at_trigger
  BEFORE UPDATE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER calculate_order_total_trigger
  AFTER INSERT OR UPDATE OR DELETE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION calculate_order_total();

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE garments ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for customers
CREATE POLICY "Customers can view their own data" ON customers
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can create customer profiles" ON customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers can update their own data" ON customers
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Create policies for measurements
CREATE POLICY "Customers can view their own measurements" ON measurements
  FOR SELECT USING (customer_id::text = auth.uid()::text);

CREATE POLICY "Anyone can create measurements" ON measurements
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers can update their own measurements" ON measurements
  FOR UPDATE USING (customer_id::text = auth.uid()::text);

-- Create policies for fabrics (public read)
CREATE POLICY "Anyone can view active fabrics" ON fabrics
  FOR SELECT USING (is_active = true);

-- Create policies for garments (public read)
CREATE POLICY "Anyone can view active garments" ON garments
  FOR SELECT USING (is_active = true);

-- Create policies for orders
CREATE POLICY "Customers can view their own orders" ON orders
  FOR SELECT USING (customer_id::text = auth.uid()::text);

CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view orders by tracking ID" ON orders
  FOR SELECT USING (true);

-- Create policies for order items
CREATE POLICY "Anyone can view order items" ON order_items
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Admin policies (will be handled by checking JWT claims)
CREATE POLICY "Admins can manage all data" ON customers
  FOR ALL USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admins can manage measurements" ON measurements
  FOR ALL USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admins can manage fabrics" ON fabrics
  FOR ALL USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admins can manage garments" ON garments
  FOR ALL USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admins can manage orders" ON orders
  FOR ALL USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admins can manage order items" ON order_items
  FOR ALL USING ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admins can manage admin users" ON admin_users
  FOR ALL USING ((auth.jwt() ->> 'role') = 'admin');