'use client';

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const CITIES = [
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
];

const CATEGORIES = [
  { label: 'All Categories', value: '' },
  { label: 'Homes', value: 'home' },
  { label: 'Plots', value: 'plot' },
  { label: 'Commercial', value: 'commercial' },
];

const PROPERTY_TYPES = {
  home: [
    { label: 'All Home Types', value: '' },
    { label: 'House', value: 'house' },
    { label: 'Flat / Apartment', value: 'flat' },
    { label: 'Upper Portion', value: 'upper_portion' },
    { label: 'Lower Portion', value: 'lower_portion' },
    { label: 'Farm House', value: 'farm_house' },
    { label: 'Penthouse', value: 'penthouse' },
  ],
  plot: [
    { label: 'All Plot Types', value: '' },
    { label: 'Residential Plot', value: 'residential_plot' },
    { label: 'Commercial Plot', value: 'commercial_plot' },
    { label: 'Agricultural Land', value: 'agricultural_land' },
    { label: 'Plot File', value: 'plot_file' },
  ],
  commercial: [
    { label: 'All Commercial Types', value: '' },
    { label: 'Office', value: 'office' },
    { label: 'Shop', value: 'shop' },
    { label: 'Building / Plaza', value: 'building' },
    { label: 'Warehouse', value: 'warehouse' },
  ],
};

export const FilterSidebar = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const handleFieldChange = (field, value) => {
    onChange({
      ...filters,
      [field]: value,
      page: 1,
    });
  };

  const currentTypes = filters.category && PROPERTY_TYPES[filters.category]
    ? PROPERTY_TYPES[filters.category]
    : [
        { label: 'All Property Types', value: '' },
        { label: 'House', value: 'house' },
        { label: 'Flat', value: 'flat' },
        { label: 'Residential Plot', value: 'residential_plot' },
        { label: 'Commercial Plot', value: 'commercial_plot' },
        { label: 'Office', value: 'office' },
        { label: 'Shop', value: 'shop' },
      ];

  return (
    <aside className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-base">Filter Properties</h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
          Purpose
        </label>
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => handleFieldChange('purpose', 'sale')}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              filters.purpose === 'sale' || !filters.purpose
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            For Sale
          </button>
          <button
            type="button"
            onClick={() => handleFieldChange('purpose', 'rent')}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              filters.purpose === 'rent'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            For Rent
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
          City
        </label>
        <select
          value={filters.city || ''}
          onChange={(e) => handleFieldChange('city', e.target.value)}
          className="w-full px-3 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        >
          <option value="">All Pakistan Cities</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
          Locality / Area Keyword
        </label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => handleFieldChange('search', e.target.value)}
          placeholder="e.g. DHA, Bahria, F-7, Clifton"
          className="w-full px-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
          Property Category
        </label>
        <select
          value={filters.category || ''}
          onChange={(e) => {
            handleFieldChange('category', e.target.value);
            handleFieldChange('propertyType', '');
          }}
          className="w-full px-3 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
          Property Type
        </label>
        <select
          value={filters.propertyType || ''}
          onChange={(e) => handleFieldChange('propertyType', e.target.value)}
          className="w-full px-3 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        >
          {currentTypes.map((pt) => (
            <option key={pt.value} value={pt.value}>
              {pt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
          Price Range (PKR)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice || ''}
            onChange={(e) => handleFieldChange('minPrice', e.target.value)}
            className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice || ''}
            onChange={(e) => handleFieldChange('maxPrice', e.target.value)}
            className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
          Bedrooms
        </label>
        <div className="flex flex-wrap gap-1.5">
          {['', '1', '2', '3', '4', '5', '5+'].map((bed) => (
            <button
              key={bed || 'all'}
              type="button"
              onClick={() => handleFieldChange('bedrooms', bed)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                filters.bedrooms === bed || (!filters.bedrooms && bed === '')
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {bed === '' ? 'Any' : bed}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
          Covered Area
        </label>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {['marla', 'kanal', 'sqft'].map((unit) => (
            <button
              key={unit}
              type="button"
              onClick={() => handleFieldChange('areaUnit', unit)}
              className={`py-1.5 text-xs font-bold uppercase rounded-lg border transition ${
                filters.areaUnit === unit || (!filters.areaUnit && unit === 'marla')
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {unit}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min Size"
            value={filters.minArea || ''}
            onChange={(e) => handleFieldChange('minArea', e.target.value)}
            className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max Size"
            value={filters.maxArea || ''}
            onChange={(e) => handleFieldChange('maxArea', e.target.value)}
            className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.isFeatured === true || filters.isFeatured === 'true'}
            onChange={(e) => handleFieldChange('isFeatured', e.target.checked ? 'true' : '')}
            className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
          />
          <span className="text-xs font-bold text-slate-700">Verified & Featured Listings Only</span>
        </label>
      </div>
    </aside>
  );
};
