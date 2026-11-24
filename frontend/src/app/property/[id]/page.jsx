'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { LeafletMap } from '@/components/property/LeafletMap';
import { PropertyCard } from '@/components/property/PropertyCard';
import { toast } from 'sonner';
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Eye,
  Building,
  Send,
  Loader2,
  ChevronLeft,
} from 'lucide-react';

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id;
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Inquiry form states
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        const res = await api.properties.getById(id);
        if (res.success && res.data) {
          setProperty(res.data);
          setIsFavorite(res.isFavorite);
          if (res.similarProperties) {
            setSimilarProperties(res.similarProperties);
          }
        }
      } catch (err) {
        console.error('Failed to load property details:', err);
        toast.error('Failed to load property details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Autofill inquiry form when user is logged in
  useEffect(() => {
    if (user) {
      setInquiryName(user.name || '');
      setInquiryEmail(user.email || '');
      setInquiryPhone(user.phone || '');
      setInquiryMessage(
        `I am interested in "${property?.title || 'this property'}" listed for ${
          property?.displayPrice || ''
        }. Please contact me with more information.`
      );
    } else {
      setInquiryMessage('I am interested in this property. Please contact me with more information.');
    }
  }, [user, property]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error('Please log in to save properties to your favorites.');
      return;
    }
    try {
      const res = await api.favorites.toggle(id);
      setIsFavorite(res.isFavorite);
      toast.success(res.isFavorite ? 'Saved to favorites!' : 'Removed from favorites.');
    } catch (err) {
      toast.error('Could not update favorites.');
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Property link copied to clipboard!');
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryPhone || !inquiryMessage) {
      toast.error('Please fill in all inquiry fields.');
      return;
    }

    try {
      setIsSubmittingInquiry(true);
      await api.inquiries.send({
        propertyId: id,
        name: inquiryName,
        email: inquiryEmail,
        phone: inquiryPhone,
        message: inquiryMessage,
      });
      toast.success('Inquiry sent successfully! The agent/seller will contact you shortly.');
      setInquiryMessage('');
    } catch (err) {
      toast.error(err.message || 'Failed to send inquiry.');
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-emerald-600">
        <Loader2 className="w-10 h-10 animate-spin mb-3" />
        <p className="text-sm font-bold text-slate-600">Loading verified property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Property Not Found</h2>
        <p className="text-slate-500 mb-6">This listing may have been sold or removed by the seller.</p>
        <Link
          href="/properties-for-sale"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Browse Available Properties</span>
        </Link>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 ? property.images : [
    { url: property.featuredImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
  ];

  const sellerPhone = property.user?.phone || '+923000000000';
  const whatsappNumber = property.user?.whatsapp || sellerPhone;
  const sanitizedWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb & Share/Favorite CTAs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-6 border-b border-slate-200 gap-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-emerald-600 transition">Home</Link>
          <span>/</span>
          <Link
            href={property.purpose === 'rent' ? '/properties-for-rent' : '/properties-for-sale'}
            className="hover:text-emerald-600 capitalize transition"
          >
            {property.purpose === 'rent' ? 'For Rent' : 'For Sale'}
          </Link>
          <span>/</span>
          <Link
            href={`/properties-for-sale/${encodeURIComponent(property.location.city.toLowerCase())}`}
            className="hover:text-emerald-600 transition"
          >
            {property.location.city}
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-xs">
            {property.location.area}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleFavoriteToggle}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm ${
              isFavorite
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{isFavorite ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition shadow-sm"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Gallery, Specs, Description, Features, Map */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. High-Res Image Gallery */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-3">
            {/* Main Active Image */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={images[selectedImageIndex]?.url}
                alt={property.title}
                className="w-full h-full object-cover transition duration-300"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="text-xs font-black uppercase bg-emerald-600 text-white px-3 py-1 rounded-lg shadow-md">
                  For {property.purpose}
                </span>
                {property.isFeatured && (
                  <span className="text-xs font-black uppercase bg-amber-500 text-white px-3 py-1 rounded-lg shadow-md">
                    Featured
                  </span>
                )}
              </div>
              <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20">
                Photo {selectedImageIndex + 1} of {images.length}
              </div>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      selectedImageIndex === idx
                        ? 'border-emerald-600 scale-95 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Header Specs & Price Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight">
                  {property.displayPrice || `PKR ${property.price.toLocaleString()}`}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-semibold">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{property.location.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-slate-500" />
                  {property.views || 48} Views
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  Added {new Date(property.createdAt).toLocaleDateString('en-PK')}
                </span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-6 mb-6 leading-snug">
              {property.title}
            </h1>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
              <div className="p-2">
                <p className="text-[11px] font-bold uppercase text-slate-400 mb-1">Area Size</p>
                <div className="flex items-center justify-center gap-1 text-slate-800 font-black text-base">
                  <Maximize className="w-4 h-4 text-emerald-600" />
                  <span>
                    {property.areaSize} {property.areaUnit}
                  </span>
                </div>
              </div>

              <div className="p-2 border-l border-slate-200">
                <p className="text-[11px] font-bold uppercase text-slate-400 mb-1">Bedrooms</p>
                <div className="flex items-center justify-center gap-1 text-slate-800 font-black text-base">
                  <Bed className="w-4 h-4 text-emerald-600" />
                  <span>{property.bedrooms || 'N/A'}</span>
                </div>
              </div>

              <div className="p-2 border-l border-slate-200">
                <p className="text-[11px] font-bold uppercase text-slate-400 mb-1">Bathrooms</p>
                <div className="flex items-center justify-center gap-1 text-slate-800 font-black text-base">
                  <Bath className="w-4 h-4 text-emerald-600" />
                  <span>{property.bathrooms || 'N/A'}</span>
                </div>
              </div>

              <div className="p-2 border-l border-slate-200">
                <p className="text-[11px] font-bold uppercase text-slate-400 mb-1">Type</p>
                <div className="flex items-center justify-center gap-1 text-slate-800 font-black text-base capitalize">
                  <Building className="w-4 h-4 text-emerald-600" />
                  <span className="truncate">{property.propertyType.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Description */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
              Property Description
            </h2>
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-normal space-y-4">
              {property.description}
            </div>
          </div>

          {/* 4. Amenities & Features Checklist */}
          {property.features && property.features.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
                Amenities & Facilities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {property.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. OpenStreetMap Location */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Map & Surroundings</h2>
              <span className="text-xs font-bold text-emerald-600">
                📍 {property.location.area}, {property.location.city}
              </span>
            </div>
            <div className="h-80 w-full rounded-2xl overflow-hidden">
              <LeafletMap properties={[property]} zoom={14} />
            </div>
          </div>
        </div>

        {/* Right Column: Seller Profile & Contact Inquiry Form */}
        <div className="lg:col-span-4 space-y-6">
          {/* Agent / Seller Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm sticky top-24">
            <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 overflow-hidden flex items-center justify-center font-bold text-emerald-800 text-xl shrink-0">
                {property.agency?.agencyLogo || property.user?.avatar ? (
                  <img
                    src={property.agency?.agencyLogo || property.user?.avatar}
                    alt="Seller Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (property.agency?.agencyName || property.user?.name || 'A').charAt(0)
                )}
              </div>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Real Estate Partner
                </div>
                <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
                  {property.agency?.agencyName || property.user?.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Member since {new Date(property.createdAt).getFullYear()}
                </p>
              </div>
            </div>

            {/* Quick Contact CTAs */}
            <div className="grid grid-cols-2 gap-2.5 my-5">
              <a
                href={`tel:${sellerPhone}`}
                className="flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Seller</span>
              </a>

              <a
                href={`https://wa.me/${sanitizedWhatsApp}?text=${encodeURIComponent(
                  `Assalam-o-Alaikum, I am inquiring about your property on PakProperty: "${property.title}" (${property.displayPrice}). Link: ${
                    typeof window !== 'undefined' ? window.location.href : ''
                  }`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Send Inquiry Form */}
            <form onSubmit={handleInquirySubmit} className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Send Direct Message
              </h4>

              <div>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Phone Number (e.g. +92 3XX XXXXXXX)"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <textarea
                  rows={3}
                  placeholder="Your inquiry message..."
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingInquiry}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
              >
                {isSubmittingInquiry ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Seller</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties && similarProperties.length > 0 && (
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900">Similar Properties in {property.location.city}</h2>
            <p className="text-xs text-slate-500 mt-1">Other matching listings you might like</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProperties.map((simProp) => (
              <PropertyCard key={simProp._id} property={simProp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
