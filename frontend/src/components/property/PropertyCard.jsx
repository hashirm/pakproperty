'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Heart,
  Phone,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const PropertyCard = ({
  property,
  onFavoriteToggle,
  isInitialFavorite = false,
}) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(isInitialFavorite);
  const [isFavLoading, setIsFavLoading] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert('Please sign in to save properties to your favorites.');
      return;
    }

    try {
      setIsFavLoading(true);
      const res = await api.favorites.toggle(property._id);
      setIsFavorite(res.isFavorite);
      if (onFavoriteToggle) {
        onFavoriteToggle(property._id, res.isFavorite);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setIsFavLoading(false);
    }
  };

  const sellerPhone = property.user?.phone || '+923000000000';
  const whatsappNumber = property.user?.whatsapp || sellerPhone;
  const sanitizedWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');

  const defaultImage =
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
  const displayImage = property.featuredImage || property.images?.[0]?.url || defaultImage;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Link href={`/property/${property._id}`}>
          <img
            src={displayImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        </Link>

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span
            className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-md shadow-sm ${
              property.purpose === 'sale'
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            For {property.purpose}
          </span>

          {property.isFeatured && (
            <span className="text-[11px] font-black uppercase bg-amber-500 text-white px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
              ★ Featured
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleFavoriteClick}
          disabled={isFavLoading}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-red-500 flex items-center justify-center shadow-md transition backdrop-blur-sm z-10"
        >
          <Heart
            className={`w-4 h-4 transition ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'
            }`}
          />
        </button>

        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md text-white font-black text-lg px-3 py-1.5 rounded-xl shadow-md border border-white/10">
          {property.displayPrice || `PKR ${property.price.toLocaleString()}`}
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              {property.location.area}, {property.location.city}
            </span>
          </div>

          <Link href={`/property/${property._id}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition line-clamp-2 leading-snug mb-3">
              {property.title}
            </h3>
          </Link>

          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 mb-4 border border-slate-100">
            {property.bedrooms !== undefined && property.bedrooms > 0 ? (
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{property.bedrooms} Beds</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="capitalize">{property.propertyType?.replace('_', ' ')}</span>
              </div>
            )}

            {property.bathrooms !== undefined && property.bathrooms > 0 ? (
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{property.bathrooms} Baths</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified</span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Maximize className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="capitalize">
                {property.areaSize} {property.areaUnit}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
              {property.agency?.agencyName?.charAt(0) || property.user?.name?.charAt(0) || 'P'}
            </div>
            <span className="text-xs font-bold text-slate-700 truncate">
              {property.agency?.agencyName || property.user?.name || 'Verified Partner'}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <a
              href={`https://wa.me/${sanitizedWhatsApp}?text=${encodeURIComponent(
                `Hello, I am interested in your property on PakProperty: "${property.title}" (${property.displayPrice})`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white flex items-center justify-center transition shadow-sm"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <a
              href={`tel:${sellerPhone}`}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-800 text-slate-700 hover:text-white flex items-center justify-center transition shadow-sm"
              title="Call Seller"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
