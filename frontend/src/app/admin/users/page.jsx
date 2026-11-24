'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { UserCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await api.admin.getUsers();
        if (res.success && res.data) {
          setUsers(res.data);
        }
      } catch (err) {
        console.error('Failed to load users:', err);
        toast.error('Failed to load users list.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Admin Console</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Users & Agents</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered buyers, sellers, real estate agents, and administrators.
          </p>
        </div>

        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
          Total Users: {users.length}
        </span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20 text-emerald-600">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => {
                  const roleColors = {
                    admin: 'bg-amber-100 text-amber-800',
                    agent: 'bg-emerald-100 text-emerald-800',
                    seller: 'bg-blue-100 text-blue-800',
                    buyer: 'bg-slate-100 text-slate-700',
                  };

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-bold">{u.name}</p>
                            <p className="text-slate-400 font-normal">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            roleColors[u.role] || roleColors.buyer
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold">{u.phone}</p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-PK') : 'Recently'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
