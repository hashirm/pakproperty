'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Building2,
  Home,
  PlusCircle,
  Heart,
  MessageSquare,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ChevronDown,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [buyDropdownOpen, setBuyDropdownOpen] = useState(false);
  const [rentDropdownOpen, setRentDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Pakistan's #1 Verified Real Estate Marketplace
            </span>
            <span className="text-slate-400">|</span>
            <span className="flex items-center gap-1 hover:text-white transition">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              UAN: 0800-72577 (PAKPROP)
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Currency: <strong className="text-white">PKR</strong></span>
            <span>•</span>
            <span className="text-slate-400">Area: <strong className="text-white">Marla / Kanal</strong></span>
            <span>•</span>
            <Link href="/agents" className="hover:text-emerald-400 transition">
              Find Verified Agents
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Pak<span className="text-emerald-600">Property</span>
                </span>
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  PK
                </span>
              </div>
              <p className="text-[10px] tracking-wider text-slate-500 uppercase font-semibold">
                Homes • Plots • Commercial
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Buy Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setBuyDropdownOpen(true)}
              onMouseLeave={() => setBuyDropdownOpen(false)}
            >
              <Link
                href="/properties-for-sale"
                className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                  pathname.startsWith('/properties-for-sale')
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                Buy
                <ChevronDown className="w-4 h-4" />
              </Link>

              {buyDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Properties For Sale
                  </div>
                  <Link
                    href="/properties-for-sale?category=home&propertyType=house"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
                  >
                    Houses for Sale
                  </Link>
                  <Link
                    href="/properties-for-sale?category=home&propertyType=flat"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
                  >
                    Flats & Apartments
                  </Link>
                  <Link
                    href="/properties-for-sale?category=plot"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
                  >
                    Residential & Commercial Plots
                  </Link>
                  <Link
                    href="/properties-for-sale?category=commercial"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
                  >
                    Commercial Properties
                  </Link>
                </div>
              )}
            </div>

            {/* Rent Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setRentDropdownOpen(true)}
              onMouseLeave={() => setRentDropdownOpen(false)}
            >
              <Link
                href="/properties-for-rent"
                className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                  pathname.startsWith('/properties-for-rent')
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                Rent
                <ChevronDown className="w-4 h-4" />
              </Link>

              {rentDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Properties For Rent
                  </div>
                  <Link
                    href="/properties-for-rent?category=home&propertyType=house"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
                  >
                    Houses for Rent
                  </Link>
                  <Link
                    href="/properties-for-rent?category=home&propertyType=flat"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
                  >
                    Apartments for Rent
                  </Link>
                  <Link
                    href="/properties-for-rent?category=commercial&propertyType=office"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
                  >
                    Offices & Commercial Spaces
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/agents"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                pathname === '/agents'
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              Agents
            </Link>

            <Link
              href="/projects"
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              New Projects
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/submit-property"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Property</span>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="text-left hidden xl:block pr-1">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-semibold capitalize">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-500">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <Home className="w-4 h-4" />
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/my-properties"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <Building2 className="w-4 h-4" />
                      My Listings
                    </Link>

                    <Link
                      href="/dashboard/favorites"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <Heart className="w-4 h-4" />
                      Saved Favorites
                    </Link>

                    <Link
                      href="/dashboard/inquiries"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Received Inquiries
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        Admin Portal
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/submit-property"
              className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
            >
              + Add
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/properties-for-sale"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-800 hover:text-emerald-600"
          >
            Properties For Sale
          </Link>
          <Link
            href="/properties-for-rent"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-800 hover:text-emerald-600"
          >
            Properties For Rent
          </Link>
          <Link
            href="/agents"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-800 hover:text-emerald-600"
          >
            Verified Agents
          </Link>
          <Link
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-800 hover:text-emerald-600"
          >
            New Housing Projects
          </Link>

          <div className="border-t border-slate-100 pt-3">
            {user ? (
              <div className="space-y-2">
                <div className="text-sm font-bold text-slate-900">
                  {user.name} ({user.role})
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-slate-600 py-1"
                >
                  My Dashboard
                </Link>
                <Link
                  href="/dashboard/my-properties"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-slate-600 py-1"
                >
                  My Listings
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-semibold text-amber-600 py-1"
                  >
                    Admin Portal
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block text-sm text-red-600 font-semibold py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2 text-sm font-semibold rounded-lg border border-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
