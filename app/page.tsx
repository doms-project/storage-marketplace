'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { StorageUnit } from '@/types/database';
import { getSuggestions } from '@/lib/cities';
import { getDefaultImage } from '@/lib/images';

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic';

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic';

export default function Home() {
  const [units, setUnits] = useState<StorageUnit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<StorageUnit[]>([]);
  const [searchCity, setSearchCity] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUnits();
  }, []);

  useEffect(() => {
    filterUnits();
  }, [units, searchCity, filterType]);

  // Handle autocomplete suggestions
  useEffect(() => {
    if (searchCity.trim()) {
      const newSuggestions = getSuggestions(searchCity);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchCity]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('storage_units')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const fetchedUnits = data || [];
      setUnits(fetchedUnits);
      // Initialize filteredUnits with all units
      setFilteredUnits(fetchedUnits);
    } catch (error) {
      console.error('Error fetching units:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUnits = () => {
    let filtered = [...units];

    // Search by city or zip code (case-insensitive, trimmed)
    if (searchCity.trim()) {
      const searchTerm = searchCity.trim().toLowerCase();
      filtered = filtered.filter(
        (unit) =>
          unit.location_city.toLowerCase().includes(searchTerm) ||
          unit.location_zip.includes(searchTerm)
      );
    }

    // Filter by unit type
    if (filterType) {
      filtered = filtered.filter((unit) => unit.unit_type === filterType);
    }

    setFilteredUnits(filtered);
  };

  const clearFilters = () => {
    setSearchCity('');
    setFilterType('');
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchCity(suggestion);
    setShowSuggestions(false);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative" ref={searchRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by City or Zip Code
              </label>
              <input
                type="text"
                placeholder="Enter city or zip code..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-black bg-white"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-black"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-black bg-white"
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
          {(searchCity || filterType) && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredUnits.length} of {units.length} units
              </p>
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Units Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading storage units...</p>
          </div>
        ) : filteredUnits.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {units.length === 0
                ? 'No storage units available at the moment.'
                : 'No units match your search criteria.'}
            </p>
            {(searchCity || filterType) && (
              <button
                onClick={clearFilters}
                className="mt-4 text-red-600 hover:text-red-700 font-medium"
              >
                Clear filters to see all units
              </button>
            )}
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

