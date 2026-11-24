'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api';
import { PropertyCard } from '@/components/property/PropertyCard';
import { FilterSidebar } from '@/components/property/FilterSidebar';
import { LeafletMap } from '@/components/property/LeafletMap';
import {
  Grid,
  List,
  Map as MapIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building2,
  SlidersHorizontal,
  X,
} from 'lucide-react';

export const PropertyListingsView = ({
  initialPurpose = 'sale',
  initialCity = '',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    purpose: initialPurpose,
    city: initialCity || searchParams.get('city') || '',
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    propertyType: searchParams.get('propertyType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    minArea: searchParams.get('minArea') || '',
    maxArea: searchParams.get('maxArea') || '',
    areaUnit: searchParams.get('areaUnit') || 'marla',
    sort: searchParams.get('sort') || 'newest',
    page: searchParams.get('page') || 1,
    limit: 12,
    isFeatured: searchParams.get('isFeatured') || '',
  });

  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showMap, setShowMap] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchProperties = useCallback(async (currentFilters) => {
    try {
      setIsLoading(true);
      const res = await api.properties.getAll(currentFilters);
      if (res.success && res.data) {
        setProperties(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.error('Error fetching property listings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties(filters);
  }, [filters, fetchProperties]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params.set(k, String(v));
      }
    });
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleResetFilters = () => {
    const reset = {
      purpose: initialPurpose,
      city: initialCity,
      page: 1,
      limit: 12,
      sort: 'newest',
    };
    handleFilterChange(reset);
  };

  const pageTitle = `${filters.purpose === 'rent' ? 'Properties for Rent' : 'Properties for Sale'}${
    filters.city ? ` in ${filters.city}` : ' across Pakistan'
  }`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1.5">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-700 capitalize">
              {filters.purpose === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            {filters.city && (
              <>
                <span>/</span>
                <span className="text-emerald-700 font-bold">{filters.city}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing <strong className="text-slate-800">{pagination.total}</strong> verified property listings
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span>Filters</span>
          </button>

          <button
            onClick={() => setShowMap(!showMap)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition ${
              showMap
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>{showMap ? 'Hide Map' : 'Map View'}</span>
          </button>

          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <select
            value={filters.sort || 'newest'}
            onChange={(e) => handleFilterChange({ ...filters, sort: e.target.value })}
            className="px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            totalResults={pagination.total}
          />
        </div>

        <div className={`${showMap ? 'lg:col-span-3 grid grid-cols-1 xl:grid-cols-2 gap-6' : 'lg:col-span-3'}`}>
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-emerald-600 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-xs font-bold text-slate-500">Loading verified properties...</span>
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No properties matched your criteria</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Try broadening your price filters, selecting other sectors, or reset all filters to view all listings.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid' && !showMap
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {properties.map((prop) => (
                  <PropertyCard key={prop._id} property={prop} />
                ))}
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => handleFilterChange({ ...filters, page: pagination.page - 1 })}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <span className="text-xs font-semibold text-slate-600">
                  Page <strong className="text-slate-900">{pagination.page}</strong> of{' '}
                  <strong className="text-slate-900">{pagination.totalPages}</strong>
                </span>

                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handleFilterChange({ ...filters, page: pagination.page + 1 })}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {showMap && (
            <div className="sticky top-24 h-[650px] hidden xl:block">
              <LeafletMap properties={properties} />
            </div>
          )}
        </div>
      </div>

      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-full max-w-sm bg-white h-full overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-base font-bold text-slate-900">Filters</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onChange={(f) => {
                handleFilterChange(f);
                setMobileFilterOpen(false);
              }}
              onReset={() => {
                handleResetFilters();
                setMobileFilterOpen(false);
              }}
              totalResults={pagination.total}
            />
          </div>
        </div>
      )}
    </div>
  );
};
