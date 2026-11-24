'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronDown } from 'lucide-react';

const PAK_CITIES = [
  'Islamabad',
  'Lahore',
  'Karachi',
  'Rawalpindi',
  'Peshawar',
  'Faisalabad',
  'Multan',
  'Quetta',
  'Abbottabad',
  'Gujranwala',
  'Sialkot',
];

const PROPERTY_TYPES = [
  { label: 'All Property Types', value: '' },
  { label: 'Houses', value: 'house', group: 'Homes' },
  { label: 'Flats & Apartments', value: 'flat', group: 'Homes' },
  { label: 'Upper Portion', value: 'upper_portion', group: 'Homes' },
  { label: 'Lower Portion', value: 'lower_portion', group: 'Homes' },
  { label: 'Farm House', value: 'farm_house', group: 'Homes' },
  { label: 'Residential Plot', value: 'residential_plot', group: 'Plots' },
  { label: 'Commercial Plot', value: 'commercial_plot', group: 'Plots' },
  { label: 'Agricultural Land', value: 'agricultural_land', group: 'Plots' },
  { label: 'Commercial Office', value: 'office', group: 'Commercial' },
  { label: 'Shop', value: 'shop', group: 'Commercial' },
  { label: 'Building / Plaza', value: 'building', group: 'Commercial' },
];

const PRICE_OPTIONS_SALE = [
  { label: 'Any Min Price', value: '' },
  { label: 'PKR 25 Lakh', value: '2500000' },
  { label: 'PKR 50 Lakh', value: '5000000' },
  { label: 'PKR 1 Crore', value: '10000000' },
  { label: 'PKR 2 Crore', value: '20000000' },
  { label: 'PKR 3 Crore', value: '30000000' },
  { label: 'PKR 5 Crore', value: '50000000' },
  { label: 'PKR 10 Crore', value: '100000000' },
];

const PRICE_OPTIONS_RENT = [
  { label: 'Any Min Rent', value: '' },
  { label: 'PKR 25,000 / mo', value: '25000' },
  { label: 'PKR 50,000 / mo', value: '50000' },
  { label: 'PKR 1 Lakh / mo', value: '100000' },
  { label: 'PKR 2 Lakh / mo', value: '200000' },
  { label: 'PKR 3 Lakh / mo', value: '300000' },
];

export const HeroSearch = () => {
  const router = useRouter();
  const [purpose, setPurpose] = useState('sale');
  const [city, setCity] = useState('Islamabad');
  const [locationQuery, setLocationQuery] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();

    if (purpose === 'projects') {
      router.push(`/projects?city=${encodeURIComponent(city)}`);
      return;
    }

    const basePath = purpose === 'rent' ? '/properties-for-rent' : '/properties-for-sale';
    const params = new URLSearchParams();

    if (city) params.append('city', city);
    if (locationQuery) params.append('search', locationQuery);
    if (propertyType) params.append('propertyType', propertyType);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (bedrooms) params.append('bedrooms', bedrooms);

    const queryString = params.toString();
    router.push(`${basePath}${queryString ? `?${queryString}` : ''}`);
  };

  const currentPriceOptions = purpose === 'rent' ? PRICE_OPTIONS_RENT : PRICE_OPTIONS_SALE;

  return (
    <div className="relative bg-slate-900 py-16 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-25 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3.5 py-1.5 rounded-full mb-6 uppercase tracking-wider backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          Search Properties in Pakistan
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
          Find Your Dream Property in <span className="text-emerald-400 underline decoration-emerald-500/40">Pakistan</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 font-normal">
          Verified homes, plots, and commercial properties across all top cities and housing societies.
        </p>

        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 text-left border border-slate-100 max-w-5xl mx-auto">
          <div className="flex border-b border-slate-200 mb-6 gap-2">
            <button
              type="button"
              onClick={() => setPurpose('sale')}
              className={`pb-3 px-6 text-sm font-black tracking-wide border-b-2 transition ${
                purpose === 'sale'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              BUY
            </button>
            <button
              type="button"
              onClick={() => setPurpose('rent')}
              className={`pb-3 px-6 text-sm font-black tracking-wide border-b-2 transition ${
                purpose === 'rent'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              RENT
            </button>
            <button
              type="button"
              onClick={() => setPurpose('projects')}
              className={`pb-3 px-6 text-sm font-black tracking-wide border-b-2 transition ${
                purpose === 'projects'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              PROJECTS
            </button>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              <div className="lg:col-span-3">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  City
                </label>
                <div className="relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-3 pr-8 py-3 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none appearance-none"
                  >
                    {PAK_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="lg:col-span-6">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Location / Society / Sector
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="e.g. DHA Phase 2, Bahria Town, F-7, Clifton..."
                    className="w-full pl-10 pr-4 py-3 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="lg:col-span-3 sm:col-span-2 flex items-end">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base py-3 px-6 rounded-xl shadow-lg shadow-emerald-600/30 transition transform active:scale-98"
                >
                  <Search className="w-5 h-5" />
                  <span>Find Properties</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="relative">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {PROPERTY_TYPES.map((pt) => (
                    <option key={pt.value} value={pt.value}>
                      {pt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Min Price
                </label>
                <select
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {currentPriceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Bedrooms
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="">Any Bedrooms</option>
                  <option value="1">1 Bed</option>
                  <option value="2">2 Beds</option>
                  <option value="3">3 Beds</option>
                  <option value="4">4 Beds</option>
                  <option value="5">5 Beds</option>
                  <option value="5+">5+ Beds</option>
                </select>
              </div>
            </div>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-400">Popular:</span>
            <button
              onClick={() => {
                setCity('Islamabad');
                setLocationQuery('DHA');
                setPropertyType('house');
              }}
              className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 px-2.5 py-1 rounded-md transition font-medium"
            >
              DHA Islamabad Houses
            </button>
            <button
              onClick={() => {
                setCity('Lahore');
                setLocationQuery('Gulberg');
                setPropertyType('house');
              }}
              className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 px-2.5 py-1 rounded-md transition font-medium"
            >
              Gulberg Lahore
            </button>
            <button
              onClick={() => {
                setCity('Karachi');
                setLocationQuery('Clifton');
                setPropertyType('flat');
              }}
              className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 px-2.5 py-1 rounded-md transition font-medium"
            >
              Clifton Karachi Flats
            </button>
            <button
              onClick={() => {
                setCity('Rawalpindi');
                setLocationQuery('Bahria');
                setPropertyType('house');
              }}
              className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 px-2.5 py-1 rounded-md transition font-medium"
            >
              Bahria Town Rawalpindi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
