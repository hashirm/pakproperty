import React from 'react';
import Link from 'next/link';
import { Building2, PhoneCall, Mail, MapPin, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold shadow-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Pak<span className="text-emerald-400">Property</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              Pakistan's next-generation real estate marketplace. Explore thousands of verified residential and commercial properties, plots, luxury bungalows, and high-rise apartments across Islamabad, Lahore, Karachi, Rawalpindi, and all major cities.
            </p>

            <div className="space-y-2 pt-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>UAN: 0800-72577 (PAKPROP) • +92 51 2890000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@pakproperty.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Blue Area Jinnah Avenue, Islamabad, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Quick Links: Buy */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Properties For Sale
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/properties-for-sale/islamabad" className="hover:text-emerald-400 transition">
                  Houses in Islamabad
                </Link>
              </li>
              <li>
                <Link href="/properties-for-sale/lahore" className="hover:text-emerald-400 transition">
                  Houses in Lahore
                </Link>
              </li>
              <li>
                <Link href="/properties-for-sale/karachi" className="hover:text-emerald-400 transition">
                  Flats in Karachi
                </Link>
              </li>
              <li>
                <Link href="/properties-for-sale?category=plot" className="hover:text-emerald-400 transition">
                  Plots for Sale
                </Link>
              </li>
              <li>
                <Link href="/properties-for-sale?category=commercial" className="hover:text-emerald-400 transition">
                  Commercial Shops & Plazas
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Rent */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Properties For Rent
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/properties-for-rent/islamabad" className="hover:text-emerald-400 transition">
                  Houses for Rent in Islamabad
                </Link>
              </li>
              <li>
                <Link href="/properties-for-rent/lahore" className="hover:text-emerald-400 transition">
                  Houses for Rent in Lahore
                </Link>
              </li>
              <li>
                <Link href="/properties-for-rent/karachi" className="hover:text-emerald-400 transition">
                  Apartments for Rent in Karachi
                </Link>
              </li>
              <li>
                <Link href="/properties-for-rent?propertyType=office" className="hover:text-emerald-400 transition">
                  Offices for Rent
                </Link>
              </li>
              <li>
                <Link href="/properties-for-rent?propertyType=upper_portion" className="hover:text-emerald-400 transition">
                  Portions for Rent
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Localities & Projects */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Top Societies
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/properties-for-sale?area=DHA" className="hover:text-emerald-400 transition">
                  DHA Defense
                </Link>
              </li>
              <li>
                <Link href="/properties-for-sale?area=Bahria" className="hover:text-emerald-400 transition">
                  Bahria Town
                </Link>
              </li>
              <li>
                <Link href="/properties-for-sale?area=Gulberg" className="hover:text-emerald-400 transition">
                  Gulberg
                </Link>
              </li>
              <li>
                <Link href="/properties-for-sale?area=Clifton" className="hover:text-emerald-400 transition">
                  Clifton Karachi
                </Link>
              </li>
              <li>
                <Link href="/agents" className="hover:text-emerald-400 transition">
                  Verified Agents Directory
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PakProperty Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Verified Title Deeds
            </span>
            <span>•</span>
            <Link href="/privacy" className="hover:text-slate-400 transition">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-400 transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
