export interface StorageUnit {
  id: string;
  title: string;
  description: string;
  location_city: string;
  location_zip: string;
  price_per_month: number;
  unit_type: string;
  size_sq_ft: number;
  image_url: string | null;
  is_available: boolean;
  contact_email: string;
  created_at?: string;
}

