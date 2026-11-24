'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { PropertyCard } from '@/components/property/PropertyCard';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Star,
  Phone,
  MessageCircle,
  Building,
  MapPin,
  Building2,
  Loader2,
  ChevronLeft,
} from 'lucide-react';

export default function AgentDetailPage() {
  const params = useParams();
  const id = params?.id;
  const { user } = useAuth();

  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Review form
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchAgentDetails = async () => {
      try {
        setIsLoading(true);
        const res = await api.agents.getById(id);
        if (res.success && res.data) {
          setAgent(res.data.agent);
          setProperties(res.data.properties || []);
          setReviews(res.data.reviews || []);
        }
      } catch (err) {
        console.error('Failed to load agent details:', err);
        toast.error('Failed to load agent profile.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgentDetails();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to submit a review.');
      return;
    }
    if (!comment) {
      toast.error('Please enter a review comment.');
      return;
    }

    try {
      setIsSubmittingReview(true);
      await api.agents.addReview(id, { rating: Number(rating), comment });
      toast.success('Review submitted successfully!');
      setComment('');
      // Refresh details
      const res = await api.agents.getById(id);
      if (res.success && res.data) {
        setAgent(res.data.agent);
        setReviews(res.data.reviews || []);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-emerald-600">
        <Loader2 className="w-10 h-10 animate-spin mb-3" />
        <p className="text-sm font-bold text-slate-600">Loading agency profile...</p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Agent Not Found</h2>
        <Link
          href="/agents"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Agents Directory</span>
        </Link>
      </div>
    );
  }

  const sanitizedWhatsApp = agent.whatsapp?.replace(/[^0-9]/g, '') || agent.phone?.replace(/[^0-9]/g, '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Agent Profile Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start sm:items-center gap-5">
          <div className="w-24 h-24 rounded-3xl bg-emerald-50 border-2 border-emerald-100 overflow-hidden flex items-center justify-center shrink-0 shadow-md">
            {agent.agencyLogo ? (
              <img src={agent.agencyLogo} alt={agent.agencyName} className="w-full h-full object-cover" />
            ) : (
              <Building className="w-12 h-12 text-emerald-600" />
            )}
          </div>

          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-1.5 border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Real Estate Consultant
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{agent.agencyName}</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Operating in {agent.city}, Pakistan • {agent.experienceYears}+ Years Industry Experience
              </span>
            </p>
          </div>
        </div>

        {/* Contact CTAs */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {agent.phone && (
            <a
              href={`tel:${agent.phone}`}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call Agency</span>
            </a>
          )}
          {sanitizedWhatsApp && (
            <a
              href={`https://wa.me/${sanitizedWhatsApp}?text=${encodeURIComponent(
                `Hello ${agent.agencyName}, I found your agency profile on PakProperty and would like to inquire about properties.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>
      </div>

      {/* Agency Bio & Operating Areas */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
          About {agent.agencyName}
        </h2>
        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-normal">
          {agent.bio || 'Verified real estate consultant helping clients buy, sell, and rent properties across Pakistan.'}
        </p>

        {agent.operatingAreas && agent.operatingAreas.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              Key Specialization Areas
            </h4>
            <div className="flex flex-wrap gap-2">
              {agent.operatingAreas.map((area) => (
                <span
                  key={area}
                  className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs font-semibold"
                >
                  📍 {area}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active Listings Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Active Properties by {agent.agencyName}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified listings managed by this consultancy ({properties.length} listings)
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No active listings available right now</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        )}
      </div>

      {/* Reviews & Leave a Review Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-slate-200">
        {/* Reviews List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-slate-900">Client Reviews</h3>
            <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-xs font-black text-amber-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{agent.rating?.toFixed(1) || '5.0'}</span>
              <span className="text-amber-700">({reviews.length} reviews)</span>
            </div>
          </div>

          {reviews.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No reviews posted yet. Be the first to share your experience!</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev._id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{rev.author?.name || 'Verified Client'}</span>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leave Review Form */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">
              Write an Agent Review
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars - Outstanding</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars - Very Good</option>
                  <option value="3">⭐⭐⭐ 3 Stars - Average</option>
                  <option value="2">⭐⭐ 2 Stars - Below Average</option>
                  <option value="1">⭐ 1 Star - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Your Experience
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share feedback on transparency, documentation support, and responsiveness..."
                  required
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
              >
                {isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : <span>Submit Review</span>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
