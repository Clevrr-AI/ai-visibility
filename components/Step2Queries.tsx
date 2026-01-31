
import React, { useState, useEffect, useRef } from 'react';
import { BrandInput } from '../types';
import { api } from '../services/api';
import { 
  Trash2, Plus, Zap, CheckCircle2, Loader2, Mail, 
  ShieldCheck, Lock, ArrowRight, X, Info
} from 'lucide-react';

interface Props {
  initialQueries: string[];
  onAnalysisStart: (queries: string[]) => void;
  loading: boolean;
  brandName: string;
  brandInfo: BrandInput | null;
  docId: string;
}

const Step2Queries: React.FC<Props> = ({ initialQueries, onAnalysisStart, loading, brandName, brandInfo, docId }) => {
  const [queries, setQueries] = useState<string[]>(initialQueries);
  const [newQuery, setNewQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'details' | 'otp'>('details');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const removeQuery = (index: number) => {
    setQueries(queries.filter((_, i) => i !== index));
  };

  const addQuery = () => {
    if (newQuery.trim() && queries.length < 10) {
      setQueries([...queries, newQuery.trim()]);
      setNewQuery('');
    }
  };

  const handleStartVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);
    try {
      const res = await api.sendOtp(email);
      if (res.response === 'success') {
        setModalStep('otp');
      } else {
        setModalError(res.error || res.message || 'Failed to send verification code.');
      }
    } catch (err) {
      setModalError('Network error. Verification service unavailable.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleVerifyAndAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandInfo) return;
    
    setModalLoading(true);
    setModalError(null);
    try {
      const keywordList = brandInfo.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
      
      const res = await api.verifyOtp({
        email,
        otp: parseInt(otp),
        brand: brandInfo.name,
        domain: brandInfo.domain,
        keywords: keywordList,
        queries: queries,
        doc_id: docId
      });

      if (res.response === 'success') {
        await api.saveContact(email, brandInfo);
        setIsModalOpen(false);
        onAnalysisStart(queries);
      } else {
        setModalError(res.error || 'Invalid verification code.');
      }
    } catch (err) {
      setModalError('Verification failed. Please retry.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 md:px-0">
      <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100 border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-12">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black mb-4 uppercase tracking-widest">
              <CheckCircle2 className="w-3.5 h-3.5" /> Intelligence Engine Ready
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Review AI Search Intents</h2>
            <p className="text-gray-500 max-w-lg mx-auto leading-relaxed text-sm md:text-base">
              We generated these queries based on typical buyer behavior. Refine them before we trigger the real-time analysis.
            </p>
          </div>

          <div className="space-y-4 mb-10">
            {queries.map((q, idx) => (
              <QueryRow 
                key={idx} 
                index={idx} 
                value={q} 
                onChange={(val) => {
                  const updated = [...queries];
                  updated[idx] = val;
                  setQueries(updated);
                }}
                onRemove={() => removeQuery(idx)}
              />
            ))}

            <div className="flex flex-col sm:flex-row gap-3">
              <textarea
                rows={1}
                placeholder="Add your own search intent..."
                className="flex-grow px-5 py-4 bg-white border-2 border-dashed border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all font-medium text-gray-600 resize-none overflow-hidden min-h-[58px]"
                value={newQuery}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
                onChange={(e) => setNewQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addQuery();
                  }
                }}
              />
              <button
                onClick={addQuery}
                className="h-[58px] sm:w-[58px] bg-gray-100 text-gray-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center font-bold group flex-shrink-0"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            disabled={queries.length === 0 || loading}
            className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-black text-xl rounded-2xl shadow-2xl shadow-indigo-300 flex items-center justify-center gap-4 transition-all transform hover:-translate-y-1 active:scale-95"
          >
            {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Zap className="w-7 h-7 fill-white" />}
            Get Insights for {brandName}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-all z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-10 pt-12">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center border border-indigo-50">
                  <ShieldCheck className="w-8 h-8 text-indigo-600" />
                </div>
              </div>

              {modalStep === 'details' ? (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Secure Your Report</h3>
                    <p className="text-gray-500 text-base md:text-lg">Verify your work email to unlock the growth analysis matrix.</p>
                  </div>

                  <form onSubmit={handleStartVerification} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-indigo-600 uppercase tracking-widest ml-1">Work Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-indigo-300" />
                        <input
                          required
                          type="email"
                          placeholder="founder@brand.com"
                          className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-indigo-500 focus:bg-white outline-none transition-all font-semibold text-lg"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    {modalError && (
                      <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3">
                        <Info className="w-5 h-5 flex-shrink-0" /> {modalError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={modalLoading}
                      className="w-full py-5 bg-indigo-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all"
                    >
                      {modalLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Send Secure Code <ArrowRight className="w-5 h-5" /></>}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-3xl font-black text-gray-900 mb-2">Check Your Inbox</h3>
                    <p className="text-gray-500">A security code was sent to <strong>{email}</strong></p>
                  </div>

                  <form onSubmit={handleVerifyAndAnalyze} className="space-y-6">
                    <div className="p-6 border-2 border-dashed border-indigo-200 rounded-3xl bg-indigo-50/30 flex justify-center items-center">
                      <div className="bg-white border-2 border-indigo-100 rounded-2xl px-6 py-4 shadow-sm">
                        <input
                          required
                          type="text"
                          maxLength={6}
                          placeholder="000000"
                          className="w-full max-w-[200px] text-center text-3xl md:text-4xl font-black tracking-[0.4em] focus:ring-0 outline-none transition-all text-indigo-600 placeholder-indigo-100"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        />
                      </div>
                    </div>

                    {modalError && (
                      <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold text-center">
                        {modalError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={modalLoading || otp.length < 6}
                      className="w-full py-5 bg-indigo-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-[0.98]"
                    >
                      {modalLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify & Launch Analysis'}
                    </button>
                    
                    <div className="text-center">
                      <button 
                        type="button" 
                        onClick={() => setModalStep('details')}
                        className="text-sm font-bold text-gray-400 hover:text-indigo-600 transition-all underline decoration-2 underline-offset-4"
                      >
                        Change Email
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-gray-100 flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-[10px] leading-relaxed font-bold text-gray-400 uppercase tracking-widest">
                  ENTERPRISE GRADE PRIVACY. WE <span className="text-indigo-600 font-black">NEVER</span> SPAM OR SELL YOUR DATA. YOUR BUSINESS DETAILS ARE SECURE.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const QueryRow: React.FC<{ index: number; value: string; onChange: (val: string) => void; onRemove: () => void }> = ({ index, value, onChange, onRemove }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <div className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl group hover:border-indigo-300 hover:bg-white transition-all shadow-sm">
      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs mt-0.5">
        {index + 1}
      </span>
      <textarea
        ref={textareaRef}
        rows={1}
        className="flex-grow bg-transparent font-semibold text-gray-700 focus:outline-none resize-none overflow-hidden py-1.5"
        value={value}
        onInput={adjustHeight}
        onChange={(e) => onChange(e.target.value)}
      />
      <button 
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 md:opacity-0 sm:opacity-100 text-gray-400 hover:text-red-500 transition-all p-2 rounded-lg hover:bg-red-50 flex-shrink-0 mt-0.5"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Step2Queries;
