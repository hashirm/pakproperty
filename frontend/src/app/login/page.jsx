'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Building2, Lock, Mail, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      toast.success('Welcome back! Signed in successfully.');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    toast.info(`Filled credentials for ${demoEmail}`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Building2 className="w-7 h-7" />
            </div>
          </Link>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to PakProperty
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your property dashboard, listings, and inquiries
          </p>
        </div>

        {/* Demo Fast-Login Selector */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>1-Click Demo Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setDemoAccount('admin@pakproperty.com', 'adminpassword123')}
              className="py-1.5 px-2 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg border border-slate-200 font-bold transition text-left"
            >
              👑 Admin Console
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('tariq@apexproperties.pk', 'password123')}
              className="py-1.5 px-2 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg border border-slate-200 font-bold transition text-left"
            >
              🏢 Verified Agent
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('seller@pakproperty.com', 'password123')}
              className="py-1.5 px-2 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg border border-slate-200 font-bold transition text-left"
            >
              🏡 Property Seller
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('buyer@pakproperty.com', 'password123')}
              className="py-1.5 px-2 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg border border-slate-200 font-bold transition text-left"
            >
              🔍 Regular Buyer
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full pl-10 pr-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase text-slate-600">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition transform active:scale-98 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Sign In</span>}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 pt-2">
          Don't have an account yet?{' '}
          <Link href="/register" className="font-bold text-emerald-600 hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
