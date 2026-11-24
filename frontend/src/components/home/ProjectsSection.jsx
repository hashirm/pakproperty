'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

const PROJECTS = [
  {
    name: 'Park View City',
    location: 'Zone IV, Malot Road, Islamabad',
    category: 'CDA Approved Housing Society',
    priceStarting: 'PKR 65 Lakh',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    tags: ['Hill Views', 'Dancing Fountain', 'Fast Possession'],
  },
  {
    name: 'DHA Raya Golf Resort',
    location: 'Sector M, DHA Phase 6, Lahore',
    category: 'Luxury Fairways & Fairway Villas',
    priceStarting: 'PKR 4.5 Crore',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    tags: ['18-Hole Golf Course', 'Elite Club', 'Underground Utilities'],
  },
  {
    name: 'Bahria Town Karachi',
    location: 'M-9 Super Highway, Karachi',
    category: 'Master Planned Mega City',
    priceStarting: 'PKR 35 Lakh',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
    tags: ['Theme Park', 'Central Mosque', '24/7 Power'],
  },
];

export const ProjectsSection = () => {
  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Major Developments
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              New Housing Projects in Pakistan
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Invest directly in master-planned communities, high-rises, and gated residential schemes.
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 transition"
          >
            <span>Explore All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROJECTS.map((proj) => (
            <div
              key={proj.name}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={proj.image}
                  alt={proj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                  Starting {proj.priceStarting}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{proj.location}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition mb-1">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-emerald-700 font-semibold mb-3">{proj.category}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full"
                      >
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/properties-for-sale?search=${encodeURIComponent(proj.name)}`}
                  className="w-full text-center py-2.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs rounded-xl transition"
                >
                  View Available Inventory
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
