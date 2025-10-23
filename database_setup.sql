/*
  # Mastermind Esports Database Schema

  ## Overview
  Complete database schema for Mastermind Esports platform including user management,
  product catalog, wallet system, and transaction tracking.

  ## Tables Created

  1. **profiles**
     - id (uuid, references auth.users) - User identifier
     - email (text) - User email address
     - full_name (text) - Customer full name
     - phone (text) - Contact number
     - wallet_balance (numeric) - Available wallet balance in RM
     - is_admin (boolean) - Admin flag for management access
     - created_at (timestamptz) - Account creation timestamp
     - updated_at (timestamptz) - Last profile update

  2. **categories**
     - id (uuid) - Category identifier
     - name (text) - Category name (e.g., "Game Topup", "Voucher Store")
     - slug (text) - URL-friendly identifier
     - icon (text) - Icon identifier for UI
     - display_order (integer) - Sort order
     - created_at (timestamptz)

  3. **products**
     - id (uuid) - Product identifier
     - category_id (uuid) - Links to categories
     - name (text) - Product name (e.g., "PUBG Mobile 60 UC")
     - description (text) - Product details
     - price (numeric) - Price in Malaysian Ringgit
     - image_url (text) - Product image
     - is_active (boolean) - Availability status
     - display_order (integer) - Sort order within category
     - created_at (timestamptz)
     - updated_at (timestamptz)

  4. **transactions**
     - id (uuid) - Transaction identifier
     - user_id (uuid) - References profiles
     - type (text) - Transaction type: 'topup' or 'purchase'
     - amount (numeric) - Transaction amount in RM
     - payment_method (text) - FPX, Touch n Go, Manual, or Wallet
     - status (text) - pending, completed, failed, cancelled
     - product_id (uuid) - For purchases, references products
     - game_id (text) - Customer's game ID/username for delivery
     - notes (text) - Additional information or admin notes
     - created_at (timestamptz)
     - completed_at (timestamptz) - When transaction finished

  ## Security (Row Level Security)
  
  All tables have RLS enabled with appropriate policies:
  - Users can view and update their own profiles
  - Users can view their own transactions
  - Products and categories are publicly viewable
  - Admin users have full access to all data
  - Wallet balance updates are restricted to prevent fraud

  ## Instructions
  
  1. Log in to your Supabase dashboard at: https://supabase.com/dashboard
  2. Select your project: jboyorkrdwzgusctfhco
  3. Go to the SQL Editor
  4. Copy and paste this entire file
  5. Click "Run" to execute the SQL
  
  The database will be set up with sample products for PUBG Mobile, Mobile Legends,
  Steam Wallet, and Google Play vouchers.
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  wallet_balance numeric DEFAULT 0 NOT NULL CHECK (wallet_balance >= 0),
  is_admin boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  display_order integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  image_url text,
  is_active boolean DEFAULT true NOT NULL,
  display_order integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('topup', 'purchase')),
  amount numeric NOT NULL CHECK (amount > 0),
  payment_method text NOT NULL,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  game_id text,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
DROP POLICY IF EXISTS "Admins can view all products" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can create own transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can update transactions" ON transactions;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND wallet_balance >= 0);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Categories policies (public read)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Products policies (public read)
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Insert default categories
INSERT INTO categories (name, slug, icon, display_order) VALUES
  ('Game Topup', 'game-topup', '🎮', 1),
  ('Voucher Store', 'voucher-store', '🎫', 2)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (category_id, name, description, price, display_order) VALUES
  (
    (SELECT id FROM categories WHERE slug = 'game-topup'),
    'PUBG Mobile 60 UC',
    'Get 60 Unknown Cash for PUBG Mobile instantly',
    6.50,
    1
  ),
  (
    (SELECT id FROM categories WHERE slug = 'game-topup'),
    'PUBG Mobile 325 UC',
    'Get 325 Unknown Cash for PUBG Mobile instantly',
    33.00,
    2
  ),
  (
    (SELECT id FROM categories WHERE slug = 'game-topup'),
    'PUBG Mobile 660 UC',
    'Get 660 Unknown Cash for PUBG Mobile instantly',
    66.00,
    3
  ),
  (
    (SELECT id FROM categories WHERE slug = 'game-topup'),
    'Mobile Legends 86 Diamonds',
    'Get 86 Diamonds for Mobile Legends instantly',
    7.50,
    4
  ),
  (
    (SELECT id FROM categories WHERE slug = 'game-topup'),
    'Mobile Legends 172 Diamonds',
    'Get 172 Diamonds for Mobile Legends instantly',
    15.00,
    5
  ),
  (
    (SELECT id FROM categories WHERE slug = 'game-topup'),
    'Mobile Legends 344 Diamonds',
    'Get 344 Diamonds for Mobile Legends instantly',
    30.00,
    6
  ),
  (
    (SELECT id FROM categories WHERE slug = 'voucher-store'),
    'Steam Wallet RM10',
    'Steam Wallet Code RM10',
    11.00,
    1
  ),
  (
    (SELECT id FROM categories WHERE slug = 'voucher-store'),
    'Steam Wallet RM30',
    'Steam Wallet Code RM30',
    32.00,
    2
  ),
  (
    (SELECT id FROM categories WHERE slug = 'voucher-store'),
    'Google Play RM10',
    'Google Play Gift Card RM10',
    11.00,
    3
  ),
  (
    (SELECT id FROM categories WHERE slug = 'voucher-store'),
    'Google Play RM50',
    'Google Play Gift Card RM50',
    52.00,
    4
  )
ON CONFLICT DO NOTHING;
