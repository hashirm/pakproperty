'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import {
  Building2,
  Clock,
  MessageSquare,
  Heart,
  PlusCircle,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [propertiesCount, setPropertiesCount] = useState({ all: 0, approved: 0, pending: 0, rejected: 0 });
  const [inquiries, setInquiries] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [propsRes, inqRes, favRes] = await Promise.all([
          api.user.getMyProperties(),
          api.inquiries.getMyInquiries(),
          api.favorites.getAll(),
        ]);

        if (propsRes.success && propsRes.counts) {
          setPropertiesCount(propsRes.counts);
        }
        if (inqRes.success && inqRes.data?.received) {
          setInquiries(inqRes.data.received.slice(0, 5));
        }
        if (favRes.success && favRes.data) {
          setFavoritesCount(favRes.data.length);
        }
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Real-Time Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Assalam-o-Alaikum, {user?.name || 'User'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Manage your Pakistani properties, track received inquiries, and view saved listings.
            </p>
          </div>

          <Link
            href="/submit-property"
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition transform active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Listing</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-emerald-600 mb-2">
              <span className="text-xs font-bold uppercase text-slate-400">Active Listings</span>
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {propertiesCount.approved}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-amber-500 mb-2">
              <span className="text-xs font-bold uppercase text-slate-400">Pending Review</span>
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {propertiesCount.pending}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <span className="text-xs font-bold uppercase text-slate-400">Inquiries</span>
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {inquiries.length}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-red-500 mb-2">
              <span className="text-xs font-bold uppercase text-slate-400">Saved Favorites</span>
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {favoritesCount}
            </span>
          </div>
        </div>

        {/* Recent Inquiries Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Customer Inquiries</h2>
              <p className="text-xs text-slate-500">Direct inquiries received on your property listings</p>
            </div>
            <Link
              href="/dashboard/inquiries"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12 text-emerald-600">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No inquiries yet</p>
              <p className="text-xs text-slate-400 mt-0.5">
                When buyers inquire about your listings, their messages will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq._id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{inq.senderName}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-600 font-semibold">{inq.senderPhone}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1 italic font-normal">
                      "{inq.message}"
                    </p>
                    <p className="text-[11px] font-bold text-emerald-700">
                      Property: {inq.property?.title}
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/${inq.senderPhone?.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition shrink-0"
                  >
                    Reply on WhatsApp
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
