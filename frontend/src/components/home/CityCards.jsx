'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Building } from 'lucide-react';

const CITIES = [
  {
    name: 'Islamabad',
    count: 2450,
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=600&q=80',
    tagline: 'Capital City • DHA & CDA Sectors',
  },
  {
    name: 'Lahore',
    count: 3820,
    image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=600&q=80',
    tagline: 'Cultural Hub • DHA, Gulberg & Bahria',
  },
  {
    name: 'Karachi',
    count: 4120,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
    tagline: 'Economic Engine • Clifton & DHA',
  },
  {
    name: 'Rawalpindi',
    count: 1840,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    tagline: 'Twin City • Bahria & Chaklala',
  },
  {
    name: 'Peshawar',
    count: 920,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    tagline: 'Historic City • Hayatabad & DHA',
  },
  {
    name: 'Faisalabad',
    count: 760,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    tagline: 'Industrial Powerhouse • Madina Town',
  },
];

export const CityCards = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              Top Locations Across Pakistan
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore Properties by City
            </h2>
          </div>
          <Link
            href="/properties-for-sale"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 group"
          >
            <span>View All Pakistani Cities</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CITIES.map((city) => (
            <Link
              key={city.name}
              href={`/properties-for-sale?city=${encodeURIComponent(city.name)}`}
              className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent"></div>

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-2xl font-black tracking-tight">{city.name}</h3>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-emerald-500 transition">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-xs text-slate-300 font-medium mb-2">{city.tagline}</p>
                <div className="inline-flex items-center gap-1.5 bg-emerald-950/60 backdrop-blur-sm border border-emerald-500/30 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-md">
                  <Building className="w-3.5 h-3.5" />
                  <span>{city.count.toLocaleString()} Listings</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
