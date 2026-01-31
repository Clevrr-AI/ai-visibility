
import React, { useState, useEffect } from 'react';
import { BrandInput, GenerateQueriesResponse, ReportData, AnalysisItem } from './types';
import { api } from './services/api';
import Step1Form from './components/Step1Form';
import Step2Queries from './components/Step2Queries';
import Step3Results from './components/Step3Results';
import { Shield, Globe, Info, ExternalLink, Loader2 } from 'lucide-react';
import Navbar from './components/navbar';

enum Step {
  INPUT,
  QUERY_CONFIRMATION,
  RESULTS
}

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.INPUT);
  const [loading, setLoading] = useState(false);
  const [brandInfo, setBrandInfo] = useState<BrandInput | null>(null);
  const [queries, setQueries] = useState<string[]>([]);
  const [docId, setDocId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [preloadedResults, setPreloadedResults] = useState<Record<number, AnalysisItem>>({});

  useEffect(() => {
    const handleInitialLoad = async () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const reportId = params.get('id');

      if (path === '/ai-visibility/report' && reportId) {
        setLoading(true);
        try {
          const res = await api.getReport(reportId);
          if (res.response === 'success' && res.data) {
            const report = res.data;
            setBrandInfo({
              name: report.name,
              domain: report.domain,
              keywords: report.keywords
            });
            setQueries(report.analysis.map(a => a.query));
            setDocId(reportId);
            
            // Convert analysis list to indexed map for Step3Results
            const resultsMap: Record<number, AnalysisItem> = {};
            report.analysis.forEach((item, idx) => {
              resultsMap[idx] = item;
            });
            setPreloadedResults(resultsMap);
            setStep(Step.RESULTS);
          } else {
            setError('Could not find the requested report.');
          }
        } catch (err) {
          setError('Failed to fetch the report. It may have been moved or deleted.');
        } finally {
          setLoading(false);
        }
      }
    };

    handleInitialLoad();
  }, []);

  const handleStep1 = async (input: BrandInput) => {
    setLoading(true);
    setError(null);
    try {
      const res: GenerateQueriesResponse = await api.generateQueries(input);
      if (res.response === 'success' && Array.isArray(res.data)) {
        setBrandInfo(input);
        setQueries(res.data);
        setDocId(res.doc_id);
        setStep(Step.QUERY_CONFIRMATION);
      } else {
        const errorMessage = (res.data as { message?: string })?.message || 'Failed to generate queries. Please try again.';
        setError(errorMessage);
      }
    } catch (err) {
      setError('Connection failed. Backend might be offline.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysisStart = (confirmedQueries: string[]) => {
    setQueries(confirmedQueries);
    setStep(Step.RESULTS);
  };

  const reset = () => {
    setStep(Step.INPUT);
    setBrandInfo(null);
    setQueries([]);
    setDocId('');
    setError(null);
    setPreloadedResults({});
    // Remove query params if resetting from a report view
    if (window.location.pathname === '/report') {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className={`flex-grow ${step === Step.INPUT && !loading ? 'pb-20' : 'flex items-center justify-center p-4 md:p-12'} relative`}>
        {error && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl shadow-lg flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <p className="text-sm font-medium">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">×</button>
          </div>
        )}

        {loading && step !== Step.RESULTS && step !== Step.QUERY_CONFIRMATION && (
           <div className="flex flex-col items-center justify-center gap-4">
             <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
             <p className="text-gray-500 font-bold animate-pulse">Scanning AI Intel Database...</p>
           </div>
        )}

        {!loading || step === Step.RESULTS ? (
          <div className={`w-full ${step === Step.INPUT ? '' : 'max-w-6xl'}`}>
            {step === Step.INPUT && (
              <Step1Form onSubmit={handleStep1} loading={loading} />
            )}

            {step === Step.QUERY_CONFIRMATION && (
              <Step2Queries 
                initialQueries={queries} 
                onAnalysisStart={handleAnalysisStart} 
                loading={loading}
                brandName={brandInfo?.name || ''}
                brandInfo={brandInfo}
                docId={docId}
              />
            )}

            {step === Step.RESULTS && brandInfo && (
              <Step3Results 
                brandInfo={brandInfo}
                queries={queries}
                docId={docId}
                initialResults={Object.keys(preloadedResults).length > 0 ? preloadedResults : undefined}
                onReset={reset} 
              />
            )}
          </div>
        ) : null}
      </main>

      <footer className="py-8 text-center text-sm text-gray-400 border-t border-gray-100 bg-white">
        <p className="font-bold uppercase tracking-widest text-[10px]">© 2026 Brand Search Detective by <a href="https://getclevrr.com" className="text-indigo-600 hover:underline">Clevrr AI</a>. Powering D2C Visibility.</p>
      </footer>
    </div>
  );
};

export default App;
