'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Heart, Search, Loader2 } from 'lucide-react';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const res = await api.favorites.getAll();
        if (res.success && res.data) {
          setFavorites(res.data);
        }
      } catch (err) {
        console.error('Failed to load favorites:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleFavoriteToggle = (propertyId, newState) => {
    if (!newState) {
      setFavorites((prev) => prev.filter((p) => p._id !== propertyId));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Saved Favorites</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your saved short-list of Pakistani houses, plots, and apartments.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20 text-emerald-600">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <Heart className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No favorite properties saved</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Browse our verified properties and click the heart icon on any listing to save it here for later.
            </p>
            <Link
              href="/properties-for-sale"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              <Search className="w-4 h-4" />
              <span>Explore Properties</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {favorites.map((prop) => (
              <PropertyCard
                key={prop._id}
                property={prop}
                isInitialFavorite={true}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
