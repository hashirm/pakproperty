'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, CheckCircle, ArrowRight, Search } from 'lucide-react';

const PROJECTS_DATA = [
  {
    name: 'Park View City',
    city: 'Islamabad',
    location: 'Zone IV, Malot Road, Islamabad',
    category: 'CDA Approved Housing Scheme',
    priceStarting: 'PKR 65 Lakh',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description:
      'Premier scenic gated community nestled against the picturesque Margalla foothills. Featuring downtown commercial square, botanical gardens, and crystal dancing fountain.',
    tags: ['Hill Views', 'Dancing Fountain', '200ft Main Boulevard', 'Fast Possession'],
  },
  {
    name: 'DHA Raya Golf Resort & Fairways',
    city: 'Lahore',
    location: 'Sector M, Phase 6, DHA Lahore',
    category: 'Luxury Fairways & Fairway Villas',
    priceStarting: 'PKR 4.5 Crore',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    description:
      'High-end international golf community offering luxury detached villas and contemporary condominium apartments overlooking an 18-hole championship golf course.',
    tags: ['18-Hole Golf Course', 'Elite Clubhouse', 'Underground Utilities', 'Ring Road Access'],
  },
  {
    name: 'Bahria Town Karachi',
    city: 'Karachi',
    location: 'M-9 Super Highway, Karachi',
    category: 'Master Planned Mega City',
    priceStarting: 'PKR 35 Lakh',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    description:
      'Pakistan’s most prominent master-planned mega city with international hospital facilities, private power grid, Rafi Cricket Stadium, and Danzoo wildlife park.',
    tags: ['Theme Park', 'Central Grand Mosque', '24/7 Independent Power', 'Safari Zoo'],
  },
  {
    name: 'Eighteen Islamabad',
    city: 'Islamabad',
    location: 'Srinagar Highway, near New Islamabad Airport',
    category: 'Ultra Luxury Resort Living',
    priceStarting: 'PKR 6.5 Crore',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description:
      'An exceptional world-class destination crafted by Ora Developers & Saif Group. Features luxury branded villas, championship golf course, and The Square commercial high street.',
    tags: ['The Square Retail', 'Luxury Championship Golf', 'Resort Villas', 'Airport Link'],
  },
  {
    name: 'Multi Gardens B-17',
    city: 'Islamabad',
    location: 'GT Road / Motorway Interchange, B-17, Islamabad',
    category: 'MPCHS Approved Community',
    priceStarting: 'PKR 45 Lakh',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    description:
      'Highly developed society by MPCHS with its own dedicated interchange on the M-1 Motorway. Ideal for both mid-range family living and solid capital appreciation.',
    tags: ['Dedicated M-1 Interchange', 'Commercial Central Mall', 'Water Filtration Plants'],
  },
  {
    name: 'Bahria Town Phase 8 Rawalpindi',
    city: 'Rawalpindi',
    location: 'Phase 8, Bahria Expressway, Rawalpindi',
    category: 'Gated Master Community',
    priceStarting: 'PKR 55 Lakh',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    description:
      'Vibrant community with tens of thousands of completed residences, modern schools, commercial civic centers, and serene recreational parks.',
    tags: ['Bahria Expressway', 'Roots Millennium Campus', 'Safari Club'],
  },
];

export default function ProjectsPage() {
  const [selectedCity, setSelectedCity] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = PROJECTS_DATA.filter((p) => {
    const matchesCity = selectedCity === 'All' || p.city === selectedCity;
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    return matchesCity && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full uppercase tracking-wider mb-3 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Developments & Housing Societies</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
            New Housing Projects in Pakistan
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Invest in premier approved developments with installment plans, scenic hill views, and fast-track possession across Islamabad, Lahore, Karachi, and Rawalpindi.
          </p>

          {/* Filters */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search project name or road..."
                className="w-full pl-10 pr-4 py-3 text-xs text-slate-900 bg-white rounded-xl focus:outline-none"
              />
            </div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-3 text-xs font-bold text-slate-800 bg-white rounded-xl focus:outline-none"
            >
              <option value="All">All Cities</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
              <option value="Rawalpindi">Rawalpindi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((proj) => (
          <div
            key={proj.name}
            className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-60 overflow-hidden">
                <img
                  src={proj.image}
                  alt={proj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-xl border border-white/10">
                  Starting {proj.priceStarting}
                </div>
                <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-md shadow">
                  {proj.city}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{proj.location}</span>
                </div>

                <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition mb-1">
                  {proj.name}
                </h3>
                <p className="text-xs text-emerald-700 font-bold mb-3">{proj.category}</p>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {proj.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                    >
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Link
                href={`/properties-for-sale?search=${encodeURIComponent(proj.name)}`}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs rounded-xl transition shadow-sm"
              >
                <span>Browse Project Inventory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
