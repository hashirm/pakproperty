'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  ShieldCheck,
  Star,
  Phone,
  MessageCircle,
  Search,
  Loader2,
  Building,
} from 'lucide-react';

const CITIES = ['All Cities', 'Islamabad', 'Lahore', 'Karachi', 'Rawalpindi', 'Peshawar'];

export default function AgentsDirectoryPage() {
  const [agents, setAgents] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setIsLoading(true);
        const res = await api.agents.getAll({
          city: selectedCity === 'All Cities' ? '' : selectedCity,
          search: searchQuery,
        });
        if (res.success && res.data) {
          setAgents(res.data);
        }
      } catch (err) {
        console.error('Failed to load agents directory:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, [selectedCity, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Directory Hero */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center mb-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full uppercase tracking-wider mb-3 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Real Estate Consultants</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
            Find Top Real Estate Agents in Pakistan
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Connect directly with verified agencies specializing in CDA sectors, DHA phases, Bahria Town, and major housing schemes.
          </p>

          {/* Search Inputs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search agency name or locality..."
                className="w-full pl-10 pr-4 py-3 text-xs text-slate-900 bg-white rounded-xl focus:outline-none"
              />
            </div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-3 text-xs font-bold text-slate-800 bg-white rounded-xl focus:outline-none"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      {isLoading ? (
        <div className="flex justify-center py-24 text-emerald-600">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : agents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-slate-500 font-semibold">No real estate agents found matching your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => {
            const sanitizedWhatsApp = agent.whatsapp?.replace(/[^0-9]/g, '') || agent.phone?.replace(/[^0-9]/g, '');
            return (
              <div
                key={agent._id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 overflow-hidden flex items-center justify-center shrink-0">
                      {agent.agencyLogo ? (
                        <img
                          src={agent.agencyLogo}
                          alt={agent.agencyName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building className="w-8 h-8 text-emerald-600" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-1">
                        <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                        Verified Partner
                      </div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug truncate">
                        {agent.agencyName}
                      </h3>
                      <p className="text-xs text-slate-500">{agent.city}, Pakistan</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs mb-4">
                    <div className="flex items-center gap-1 text-amber-500 font-black">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{agent.rating?.toFixed(1) || '5.0'}</span>
                    </div>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-semibold">{agent.experienceYears}+ years exp</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-emerald-700 font-bold">
                      {agent.activeListingsCount || 0} Active Ads
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {agent.bio}
                  </p>

                  {/* Operating Areas tags */}
                  {agent.operatingAreas && agent.operatingAreas.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-5">
                      {agent.operatingAreas.slice(0, 3).map((area) => (
                        <span
                          key={area}
                          className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {agent.phone && (
                      <a
                        href={`tel:${agent.phone}`}
                        className="flex items-center justify-center gap-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Call</span>
                      </a>
                    )}
                    {sanitizedWhatsApp && (
                      <a
                        href={`https://wa.me/${sanitizedWhatsApp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>

                  <Link
                    href={`/agents/${agent._id}`}
                    className="w-full block text-center py-2 bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 font-bold text-xs rounded-xl transition"
                  >
                    View Agency Profile & Listings
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
