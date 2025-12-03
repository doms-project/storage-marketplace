'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { StorageUnit } from '@/types/database';

export default function Home() {
  const [units, setUnits] = useState<StorageUnit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<StorageUnit[]>([]);
  const [searchCity, setSearchCity] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchUnits();
  }, []);

  useEffect(() => {
    filterUnits();
  }, [units, searchCity, filterType]);

  const fetchUnits = async () => {
    try {
      const { data, error } = await supabase
        .from('storage_units')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUnits(data || []);
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const filterUnits = () => {
    let filtered = units;

    if (searchCity) {
      filtered = filtered.filter(
        (unit) =>
          unit.location_city.toLowerCase().includes(searchCity.toLowerCase()) ||
          unit.location_zip.includes(searchCity)
      );
    }

    if (filterType) {
      filtered = filtered.filter((unit) => unit.unit_type === filterType);
    }

    setFilteredUnits(filtered);
  };

  const unitTypes = Array.from(new Set(units.map((unit) => unit.unit_type)));

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
              href="/list-unit"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              List Your Unit
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find the Perfect Storage Space
          </h1>
          <p className="text-xl text-red-100">
            Rent storage units for boats, vehicles, and more
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by City or Zip Code
              </label>
              <input
                type="text"
                placeholder="Enter city or zip code..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                {unitTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Units Grid */}
        {filteredUnits.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {units.length === 0
                ? 'No storage units available at the moment.'
                : 'No units match your search criteria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnits.map((unit) => (
              <Link
                key={unit.id}
                href={`/unit/${unit.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 bg-gray-200">
                  {unit.image_url ? (
                    <img
                      src={unit.image_url}
                      alt={unit.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {unit.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{unit.location_city}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600 font-bold text-lg">
                      ${unit.price_per_month}/month
                    </span>
                    <span className="text-gray-500 text-sm">
                      {unit.size_sq_ft} sq ft
                    </span>
                  </div>
                  <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {unit.unit_type}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

