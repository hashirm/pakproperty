import React, { Suspense } from 'react';
import { PropertyListingsView } from '@/components/property/PropertyListingsView';

export default function PropertiesForSalePage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-slate-500 font-bold">Loading properties...</div>}>
      <PropertyListingsView initialPurpose="sale" />
    </Suspense>
  );
}
