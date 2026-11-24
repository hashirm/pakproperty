'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MessageSquare,
  Heart,
  User,
  ShieldCheck,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export const DashboardLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Listings', href: '/dashboard/my-properties', icon: Building2 },
    { label: 'Post New Property', href: '/submit-property', icon: PlusCircle },
    { label: 'Inquiries Inbox', href: '/dashboard/inquiries', icon: MessageSquare },
    { label: 'Saved Favorites', href: '/dashboard/favorites', icon: Heart },
    { label: 'Profile & Settings', href: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-6 sticky top-24">
            {/* User Mini Profile */}
            <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center shrink-0">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-sm truncate">{user?.name}</h3>
                <span className="inline-block text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full capitalize">
                  {user?.role} Portal
                </span>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                  </Link>
                );
              })}

              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 transition mt-4"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Admin Console</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </nav>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Dashboard Content Area */}
        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
};
