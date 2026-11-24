'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { toast } from 'sonner';
import {
  Building2,
  PlusCircle,
  Eye,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [counts, setCounts] = useState({ all: 0, approved: 0, pending: 0, rejected: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchProperties = async (status) => {
    try {
      setIsLoading(true);
      const res = await api.user.getMyProperties(status);
      if (res.success && res.data) {
        setProperties(res.data);
        if (res.counts) setCounts(res.counts);
      }
    } catch (err) {
      console.error('Failed to load user properties:', err);
      toast.error('Failed to load listings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(statusFilter);
  }, [statusFilter]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property listing? This action cannot be undone.')) {
      return;
    }

    try {
      await api.properties.delete(id);
      toast.success('Listing deleted successfully.');
      setProperties((prev) => prev.filter((p) => p._id !== id));
      setCounts((prev) => ({ ...prev, all: prev.all - 1 }));
    } catch (err) {
      toast.error(err.message || 'Failed to delete property.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Property Listings</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your active, pending, and rejected property advertisements.
            </p>
          </div>

          <Link
            href="/submit-property"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Property</span>
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 text-xs font-bold">
          <button
            onClick={() => setStatusFilter('')}
            className={`pb-3 px-4 border-b-2 transition ${
              statusFilter === ''
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All Listings ({counts.all})
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`pb-3 px-4 border-b-2 transition ${
              statusFilter === 'approved'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Active & Approved ({counts.approved})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`pb-3 px-4 border-b-2 transition ${
              statusFilter === 'pending'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Pending Review ({counts.pending})
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`pb-3 px-4 border-b-2 transition ${
              statusFilter === 'rejected'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Rejected ({counts.rejected})
          </button>
        </div>

        {/* Listings List */}
        {isLoading ? (
          <div className="flex justify-center py-20 text-emerald-600">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No properties in this view</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You don't have any listings in this status. Click below to advertise your first property.
            </p>
            <Link
              href="/submit-property"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Listing</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((prop) => {
              const statusBadges = {
                approved: {
                  bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                  icon: CheckCircle2,
                  label: 'Approved & Live',
                },
                pending: {
                  bg: 'bg-amber-50 text-amber-800 border-amber-200',
                  icon: Clock,
                  label: 'Awaiting Admin Approval',
                },
                rejected: {
                  bg: 'bg-red-50 text-red-800 border-red-200',
                  icon: AlertCircle,
                  label: 'Rejected by Moderator',
                },
              };

              const badge = statusBadges[prop.status] || statusBadges.pending;
              const StatusIcon = badge.icon;

              return (
                <div
                  key={prop._id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={prop.featuredImage || prop.images?.[0]?.url}
                        alt={prop.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${badge.bg}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                        <span className="text-xs font-black text-emerald-600">
                          {prop.displayPrice}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm truncate max-w-md">
                        {prop.title}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {prop.location.area}, {prop.location.city}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {prop.views || 0} views
                        </span>
                      </div>

                      {prop.status === 'rejected' && prop.rejectionReason && (
                        <p className="text-xs font-semibold text-red-600 mt-2 bg-red-50 p-2 rounded-lg border border-red-100">
                          Moderator Note: {prop.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    {prop.status === 'approved' && (
                      <Link
                        href={`/property/${prop._id}`}
                        target="_blank"
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(prop._id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
