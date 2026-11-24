'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  PlusCircle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      const res = await api.admin.getDashboard();
      if (res.success && res.data) {
        setStats(res.data.stats);
        setPendingProperties(res.data.recentPending || []);
        setRecentInquiries(res.data.recentInquiries || []);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      toast.error(err.message || 'Access restricted to administrators.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionInProgress(id);
      await api.admin.approve(id);
      toast.success('Listing approved and published live to marketplace!');
      setPendingProperties((prev) => prev.filter((p) => p._id !== id));
      if (stats) {
        setStats({
          ...stats,
          pendingProperties: Math.max(0, stats.pendingProperties - 1),
          approvedProperties: stats.approvedProperties + 1,
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to approve listing.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please enter the reason for rejection (e.g. Incomplete details, invalid contact info, or quality guidelines):');
    if (reason === null) return; // Cancelled

    try {
      setActionInProgress(id);
      await api.admin.reject(id, reason || 'Does not adhere to quality guidelines.');
      toast.success('Listing rejected.');
      setPendingProperties((prev) => prev.filter((p) => p._id !== id));
      if (stats) {
        setStats({
          ...stats,
          pendingProperties: Math.max(0, stats.pendingProperties - 1),
          rejectedProperties: stats.rejectedProperties + 1,
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to reject listing.');
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-amber-500/30">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator Control Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Marketplace Moderation & Governance</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Review pending property submissions, approve listings, monitor customer inquiries, and manage users.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition"
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Manage Users</span>
          </Link>
          <Link
            href="/submit-property"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Listing</span>
          </Link>
        </div>
      </div>

      {/* Metrics Counters Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Total Users</span>
            <span className="text-2xl font-black text-slate-900">{stats.totalUsers}</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Total Listings</span>
            <span className="text-2xl font-black text-slate-900">{stats.totalProperties}</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-sm bg-emerald-50/30">
            <span className="text-[10px] font-bold uppercase text-emerald-700 block mb-1">Approved & Live</span>
            <span className="text-2xl font-black text-emerald-800">{stats.approvedProperties}</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm bg-amber-50/30">
            <span className="text-[10px] font-bold uppercase text-amber-700 block mb-1">Pending Approval</span>
            <span className="text-2xl font-black text-amber-800">{stats.pendingProperties}</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-red-200 shadow-sm bg-red-50/30">
            <span className="text-[10px] font-bold uppercase text-red-700 block mb-1">Rejected</span>
            <span className="text-2xl font-black text-red-800">{stats.rejectedProperties}</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Total Inquiries</span>
            <span className="text-2xl font-black text-slate-900">{stats.totalInquiries}</span>
          </div>
        </div>
      )}

      {/* Pending Listings Moderation Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">
                Pending Property Moderation Queue
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Properties submitted by users requiring review before public search indexing
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
            {pendingProperties.length} Awaiting Review
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-emerald-600">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : pendingProperties.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">Queue is completely clear!</p>
            <p className="text-xs text-slate-400 mt-0.5">
              All submitted properties have been reviewed and processed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingProperties.map((prop) => (
              <div
                key={prop._id}
                className="p-5 rounded-2xl border border-amber-200 bg-amber-50/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={prop.featuredImage || prop.images?.[0]?.url}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        Pending
                      </span>
                      <span className="text-xs font-black text-emerald-600">
                        {prop.displayPrice}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm truncate max-w-lg">
                      {prop.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      📍 {prop.location.area}, {prop.location.city} • Submitted by{' '}
                      <strong className="text-slate-800">{prop.user?.name}</strong> (
                      {prop.user?.phone || 'No phone'})
                    </p>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-1 italic">
                      "{prop.description}"
                    </p>
                  </div>
                </div>

                {/* Approve / Reject Actions */}
                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-0 border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleApprove(prop._id)}
                    disabled={actionInProgress === prop._id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Publish</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReject(prop._id)}
                    disabled={actionInProgress === prop._id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold border border-red-200 transition disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent System Inquiries */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
          Latest Platform Inquiries
        </h2>

        {recentInquiries.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No inquiries recorded yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentInquiries.map((inq) => (
              <div key={inq._id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-900">{inq.senderName}</span>
                  <span className="text-slate-400 mx-1">inquired regarding</span>
                  <strong className="text-emerald-700">{inq.property?.title || 'Property'}</strong>
                </div>
                <span className="text-slate-400 shrink-0">
                  {new Date(inq.createdAt).toLocaleDateString('en-PK')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
