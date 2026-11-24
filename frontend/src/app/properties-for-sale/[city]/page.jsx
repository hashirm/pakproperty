import React, { Suspense } from 'react';
import { PropertyListingsView } from '@/components/property/PropertyListingsView';

export default function PropertiesForSaleCityPage({ params }) {
  const cityName = decodeURIComponent(params?.city || '');
  const formattedCity = cityName ? cityName.charAt(0).toUpperCase() + cityName.slice(1) : '';

  return (
    <Suspense fallback={<div className="py-24 text-center text-slate-500 font-bold">Loading properties...</div>}>
      <PropertyListingsView initialPurpose="sale" initialCity={formattedCity} />
    </Suspense>
  );
}
