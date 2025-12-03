-- Storage Marketplace Database Schema
-- Run this in your Supabase SQL Editor

-- Create storage_units table
CREATE TABLE storage_units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location_city TEXT NOT NULL,
  location_zip TEXT NOT NULL,
  price_per_month DECIMAL NOT NULL,
  unit_type TEXT NOT NULL,
  size_sq_ft INTEGER NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  contact_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Disable RLS for anonymous access (MVP only)
ALTER TABLE storage_units DISABLE ROW LEVEL SECURITY;

-- Create an index on location_city for faster searches
CREATE INDEX idx_storage_units_location_city ON storage_units(location_city);

-- Create an index on unit_type for faster filtering
CREATE INDEX idx_storage_units_unit_type ON storage_units(unit_type);

-- Create an index on is_available for faster filtering
CREATE INDEX idx_storage_units_is_available ON storage_units(is_available);

