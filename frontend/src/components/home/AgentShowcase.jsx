'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Star, ShieldCheck, Phone, ArrowRight, Building, Loader2 } from 'lucide-react';

export const AgentShowcase = () => {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await api.agents.getAll({ limit: 4 });
        if (res.success && res.data) {
          setAgents(res.data);
        }
      } catch (err) {
        console.error('Failed to load agents:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Consultants
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Top Real Estate Agencies & Agents
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Connect with vetted industry specialists who provide verified title deeds and direct seller pricing.
            </p>
          </div>

          <Link
            href="/agents"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-white border border-slate-200 hover:border-emerald-300 px-4 py-2 rounded-xl shadow-sm transition"
          >
            <span>View All Agents</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-emerald-600">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {agents.map((agent) => (
              <div
                key={agent._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 overflow-hidden flex items-center justify-center shrink-0">
                      {agent.agencyLogo ? (
                        <img
                          src={agent.agencyLogo}
                          alt={agent.agencyName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building className="w-6 h-6 text-emerald-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified Agency</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm truncate">
                        {agent.agencyName}
                      </h3>
                      <p className="text-xs text-slate-500">{agent.city}, Pakistan</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-amber-900 ml-1">
                        {agent.rating?.toFixed(1) || '5.0'}
                      </span>
                    </div>
                    <span className="text-xs text-amber-700">({agent.reviewCount || 0} reviews)</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs font-semibold text-slate-600">
                      {agent.experienceYears}+ yrs exp
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 font-normal leading-relaxed">
                    {agent.bio || 'Experienced real estate advisor handling luxury and commercial transactions.'}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <Link
                    href={`/agents/${agent._id}`}
                    className="w-full block text-center py-2 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition"
                  >
                    View Agency & Listings
                  </Link>
                  {agent.phone && (
                    <a
                      href={`tel:${agent.phone}`}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-600 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{agent.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
