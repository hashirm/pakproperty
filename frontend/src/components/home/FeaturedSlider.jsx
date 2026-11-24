'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

export const FeaturedSlider = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.properties.getFeatured();
        if (res.success && res.data) {
          setProperties(res.data);
        }
      } catch (err) {
        console.error('Failed to load featured properties:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Verified & Handpicked
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Properties
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top-tier residential homes, plots, and luxury apartments verified by our field agents.
            </p>
          </div>

          <Link
            href="/properties-for-sale?isFeatured=true"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-white border border-slate-200 hover:border-emerald-300 px-4 py-2 rounded-xl shadow-sm transition"
          >
            <span>Browse All Featured</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-emerald-600">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <p className="text-slate-500">No featured properties found at this moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
