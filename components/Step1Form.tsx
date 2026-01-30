
import React, { useState, useRef } from 'react';
import { BrandInput } from '../types';
import { Building2, Globe, Tag, ChevronRight, Loader2, Sparkles, ArrowDown } from 'lucide-react';

interface Props {
  onSubmit: (data: BrandInput) => void;
  loading: boolean;
}

const Step1Form: React.FC<Props> = ({ onSubmit, loading }) => {
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<BrandInput>({
    name: '',
    domain: '',
    keywords: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.domain && formData.keywords) {
      onSubmit(formData);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="w-full min-h-[85vh] flex items-center bg-[#F8F9FA] px-6 md:px-12 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <h1 className="text-6xl md:text-8xl font-black text-[#1A1A1A] leading-[0.95] tracking-tighter">
              Is your brand showing up in AI search?
            </h1>
            <p className="text-2xl md:text-3xl text-slate-500 font-medium leading-relaxed max-w-lg">
              Monitor your brand's AI visibility. Now powered by <span className="text-indigo-600 font-bold">Clevrr AI</span>.
            </p>
            <div className="pt-4">
              <button 
                onClick={scrollToForm}
                className="px-10 py-5 bg-black text-white text-xl font-black rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center gap-3"
              >
                Get started
                <ArrowDown className="w-6 h-6 animate-bounce" />
              </button>
            </div>
          </div>
          
          <div className="relative animate-in fade-in zoom-in duration-1000 delay-200">
            <div className="absolute -inset-4 bg-indigo-500/10 blur-3xl rounded-full" />
            <img 
              src="https://cdn.prod.website-files.com/61bcbae3ae2e8ee49aa790b0/696ea81a618e073f6a7ac85b_ai-visibility-hero-img.png" 
              alt="AI Visibility Hero" 
              className="relative w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section ref={formRef} className="max-w-4xl mx-auto w-full px-6 py-24 scroll-mt-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 md:p-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest">Brand Investigation Matrix</h2>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-none">
              Analyze Your <span className="text-indigo-600">Search Presence</span>
            </h2>
            <p className="text-lg text-gray-500 mb-12 font-medium leading-relaxed max-w-2xl">
              Fill in your brand details below. Our AI detective will scan recent LLM training data and real-time outputs to find where your brand is winning—and where it's invisible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                    <Building2 className="w-4 h-4" /> Brand Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ember Cookware"
                    className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white focus:shadow-lg focus:shadow-indigo-50 outline-none transition-all font-bold text-lg"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                    <Globe className="w-4 h-4" /> Brand Website
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. embercookware.com"
                    className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white focus:shadow-lg focus:shadow-indigo-50 outline-none transition-all font-bold text-lg"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                  <Tag className="w-4 h-4" /> Growth Keywords (Comma Separated)
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. non-toxic cookware India, ceramic pans, healthy cooking utensils..."
                  className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white focus:shadow-lg focus:shadow-indigo-50 outline-none transition-all resize-none font-bold text-lg leading-relaxed"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black text-2xl rounded-2xl shadow-2xl shadow-indigo-200 flex items-center justify-center gap-4 transition-all transform hover:-translate-y-1 active:scale-95"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-8 h-8 animate-spin" /> Digging Intel...
                    </>
                  ) : (
                    <>
                      Launch Investigation <ChevronRight className="w-8 h-8" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-gray-50 p-8 border-t border-gray-100 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live Analysis
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <Globe className="w-4 h-4" /> 10+ AI Models Checked
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Step1Form;
