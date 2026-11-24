'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import {
  MessageSquare,
  Mail,
  Phone,
  MessageCircle,
  Building2,
  Loader2,
} from 'lucide-react';

export default function InquiriesPage() {
  const [activeTab, setActiveTab] = useState('received');
  const [receivedInquiries, setReceivedInquiries] = useState([]);
  const [sentInquiries, setSentInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setIsLoading(true);
        const res = await api.inquiries.getMyInquiries();
        if (res.success && res.data) {
          setReceivedInquiries(res.data.received || []);
          setSentInquiries(res.data.sent || []);
        }
      } catch (err) {
        console.error('Error fetching inquiries:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const displayedList = activeTab === 'received' ? receivedInquiries : sentInquiries;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Inquiries</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage inquiries received from interested property buyers and tenants.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('received')}
            className={`pb-3 px-4 border-b-2 transition ${
              activeTab === 'received'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Received Inquiries ({receivedInquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`pb-3 px-4 border-b-2 transition ${
              activeTab === 'sent'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Sent Inquiries ({sentInquiries.length})
          </button>
        </div>

        {/* Inquiries List */}
        {isLoading ? (
          <div className="flex justify-center py-20 text-emerald-600">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : displayedList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              No {activeTab} inquiries found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeTab === 'received'
                ? 'When prospective buyers submit inquiries on your properties, they will appear here.'
                : 'Inquiries you send to sellers and agents will be recorded here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedList.map((inq) => {
              const whatsappNumber = inq.senderPhone?.replace(/[^0-9]/g, '');
              return (
                <div
                  key={inq._id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-slate-900">{inq.senderName}</span>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {inq.senderPhone}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {inq.senderEmail}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-400">
                        {new Date(inq.createdAt).toLocaleDateString('en-PK')}
                      </span>
                      {whatsappNumber && (
                        <a
                          href={`https://wa.me/${whatsappNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-normal">
                    "{inq.message}"
                  </div>

                  {/* Property Info */}
                  {inq.property && (
                    <div className="flex items-center gap-3 pt-2 text-xs">
                      <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-800 truncate">
                        Regarding: {inq.property.title}
                      </span>
                      <span className="text-emerald-700 font-bold ml-auto shrink-0">
                        {inq.property.displayPrice}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
