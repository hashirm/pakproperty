import React from 'react';
import { BookOpen, FileText, Calculator, TrendingUp } from 'lucide-react';

const GUIDES = [
  {
    title: 'Pakistani Property Units: Marla and Kanal Conversion Guide',
    excerpt: 'Detailed breakdown of Marla measurements across Lahore (225 sq ft) and CDA Islamabad (250 sq ft), with Kanal conversion charts.',
    icon: Calculator,
    readTime: '4 min read',
    category: 'Real Estate Math',
  },
  {
    title: 'FBR Property Tax & Withholding Regulations in Pakistan',
    excerpt: 'What buyers and sellers need to know regarding FBR filer vs non-filer tax rates, section 236K, and gain taxes.',
    icon: FileText,
    readTime: '6 min read',
    category: 'Legal & Taxes',
  },
  {
    title: 'Top High-Yield Investment Localities in Islamabad & Rawalpindi',
    excerpt: 'Analysis of capital appreciation rates in DHA Phase 2, Bahria Town, Park View City, and B-17 Multi Gardens.',
    icon: TrendingUp,
    readTime: '5 min read',
    category: 'Market Trends',
  },
];

export const NewsAndGuides = () => {
  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            Knowledge Base
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pakistani Real Estate Guides & Insights
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Make confident property buying, selling, and leasing decisions with our verified research and legal guides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GUIDES.map((guide) => {
            const Icon = guide.icon;
            return (
              <div
                key={guide.title}
                className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                      {guide.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{guide.readTime}</span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {guide.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200">
                  <span className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer">
                    Read Complete Guide →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
