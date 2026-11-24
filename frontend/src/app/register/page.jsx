'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Building2, Lock, Mail, User, Phone, Briefcase, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+92 ');
  const [role, setRole] = useState('seller');

  // Agent specific
  const [agencyName, setAgencyName] = useState('');
  const [city, setCity] = useState('Islamabad');
  const [experienceYears, setExperienceYears] = useState('5');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      setIsLoading(true);
      await register({
        name,
        email,
        password,
        phone,
        role,
        agencyName: role === 'agent' ? agencyName : undefined,
        city: role === 'agent' ? city : undefined,
        experienceYears: role === 'agent' ? experienceYears : undefined,
      });

      toast.success('Registration successful! Welcome to PakProperty.');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Building2 className="w-7 h-7" />
            </div>
          </Link>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Join Pakistan's leading verified property network
          </p>
        </div>

        {/* Role Selector */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
            I want to join as:
          </label>
          <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`py-2 px-1 text-xs font-bold rounded-xl transition ${
                role === 'buyer'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Buyer / Renter
            </button>
            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`py-2 px-1 text-xs font-bold rounded-xl transition ${
                role === 'seller'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Property Seller
            </button>
            <button
              type="button"
              onClick={() => setRole('agent')}
              className={`py-2 px-1 text-xs font-bold rounded-xl transition ${
                role === 'agent'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Real Estate Agent
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tariq Mehmood"
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Mobile Phone / WhatsApp
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 3XX XXXXXXX"
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Conditional Agent Fields */}
          {role === 'agent' && (
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase">
                <Briefcase className="w-4 h-4" />
                <span>Agency Details</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Agency Name</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="e.g. Apex Real Estate"
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                  >
                    <option value="Islamabad">Islamabad</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Peshawar">Peshawar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    min={1}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition transform active:scale-98 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Create Account</span>}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 pt-2">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-emerald-600 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
