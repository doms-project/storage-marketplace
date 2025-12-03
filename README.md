# Storage Marketplace

A web application for renting storage units, similar to Airbnb but for storage spaces. This MVP allows users to view and list storage units without authentication.

## Features

- **Public Homepage**: Browse all available storage units
- **Search & Filter**: Filter units by city/zip code and unit type
- **Unit Details**: View detailed information about each storage unit
- **List Unit**: Submit a new storage unit listing with image upload

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Database & Storage)
- **Vercel** (Deployment)

## Prerequisites

- **Node.js 18.17.0 or higher** (required for Next.js 14 and Supabase)
- **npm** or **yarn**
- A Supabase account (free tier works)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project in [Supabase Dashboard](https://supabase.com)
2. Create the `storage_units` table with the following schema:

```sql
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
```

3. Create a storage bucket named `unit-images`:
   - Go to Storage in Supabase Dashboard
   - Create a new bucket called `unit-images`
   - Set it to Public

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under API.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
storagebnb/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage with listings
│   ├── list-unit/
│   │   └── page.tsx         # List unit form
│   └── unit/
│       └── [id]/
│           └── page.tsx     # Unit detail page
├── lib/
│   └── supabase.ts          # Supabase client
├── types/
│   └── database.ts          # TypeScript types
└── package.json
```

## Database Schema

The `storage_units` table contains:

- `id`: UUID (Primary Key)
- `title`: Unit name
- `description`: Detailed description
- `location_city`: City for search
- `location_zip`: Zip code for search
- `price_per_month`: Rental price
- `unit_type`: Type (Garage, Warehouse, etc.)
- `size_sq_ft`: Estimated size
- `image_url`: Link to image in Supabase Storage
- `is_available`: Availability status
- `contact_email`: Email for renters to contact lister
- `created_at`: Timestamp

## Deployment

Deploy to Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Notes

- This MVP uses anonymous access to Supabase (no authentication)
- RLS is disabled for simplicity
- All operations use the public Supabase client with the anon key

