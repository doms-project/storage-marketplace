'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { StorageUnit } from '@/types/database';
import { getDefaultImage } from '@/lib/images';

export default function UnitDetail() {
  const params = useParams();
  const router = useRouter();
  const [unit, setUnit] = useState<StorageUnit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchUnit(params.id as string);
    }
  }, [params.id]);

  const fetchUnit = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('storage_units')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setUnit(data);
    } catch (error) {
      console.error('Error fetching unit:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unit Not Found</h1>
          <Link
            href="/"
            className="text-red-600 hover:text-red-700 underline"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-red-600">
              Storage Marketplace
            </Link>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              ← Back to Search
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image */}
          <div className="relative h-96 bg-gray-200">
            <img
              src={unit.image_url || getDefaultImage(unit.unit_type)}
              alt={unit.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to default image if user's image fails to load
                const target = e.target as HTMLImageElement;
                target.src = getDefaultImage(unit.unit_type);
              }}
            />
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {unit.title}
                </h1>
                <p className="text-lg text-gray-600">
                  {unit.location_city}, {unit.location_zip}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-red-600">
                  ${unit.price_per_month}
                </div>
                <div className="text-gray-500">per month</div>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {unit.unit_type}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {unit.size_sq_ft} sq ft
              </span>
              {unit.is_available && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  Available
                </span>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {unit.description}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-2">
                  To inquire about this storage unit, please contact:
                </p>
                <a
                  href={`mailto:${unit.contact_email}`}
                  className="text-red-600 hover:text-red-700 font-semibold text-lg"
                >
                  {unit.contact_email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

