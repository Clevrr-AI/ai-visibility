import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { BrandInput, AnalysisItem } from '../types';
import { api } from '../services/api';
import {
  Trophy, TrendingUp, CheckCircle2, RefreshCcw, Loader2, Target,
  Lightbulb, ChevronDown, Eye, Hash, Tag, BrainCircuit, Sparkles,
  Globe, ChevronUp, ExternalLink, Info, XCircle, AlertCircle, Clock, Mail, Download, BookOpen
} from 'lucide-react';

const StatusBox = ({ icon, label, value, success, bold }: { icon: React.ReactNode, label: string, value: string, success?: boolean, bold?: boolean }) => (
  <div className="bg-gray-50/50 p-4 md:p-5 rounded-2xl border border-gray-100 flex items-center gap-4 md:gap-5 shadow-sm hover:border-indigo-100 transition-colors">
    <div className="text-indigo-400 bg-white p-2 md:p-2.5 rounded-xl shadow-sm border border-gray-100 flex-shrink-0">{icon}</div>
    <div className="flex flex-col min-w-0">
      <span className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">{label}</span>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs md:text-sm truncate ${bold ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>{value}</span>
        {success !== undefined && (
          <span className={`px-2 py-0.5 rounded-full text-[8px] md:text-[9px] font-black uppercase ${success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
            {success ? 'Yes' : 'No'}
          </span>
        )}
      </div>
    </div>
  </div>
);

const MetricCard = ({ icon, label, value, loading, borderColor, shadowColor, accentColor }: { icon: React.ReactNode, label: string, value: string, loading: boolean, borderColor: string, shadowColor: string, accentColor: string }) => (
  <div className={`bg-white rounded-2xl p-6 md:p-8 border-l-4 ${borderColor} ${shadowColor} shadow-xl flex items-center gap-6 transition-all hover:translate-y-[-2px]`}>
    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${accentColor}`}>
      {icon}
    </div>
    <div className="space-y-1">
      {loading ? (
        <div className="w-8 h-8 border-4 border-gray-100 border-t-indigo-600 rounded-full animate-spin"></div>
      ) : (
        <p className="text-2xl md:text-3xl font-black text-gray-900 leading-none tracking-tight">{value}</p>
      )}
      <p className="text-[10px] md:text-xs font-bold text-gray-400 leading-tight uppercase tracking-wider">{label}</p>
    </div>
  </div>
);

const AnalysisItemRow = ({ query, data, loading, isWaiting, error, index, docId, brandDomain, onRetry }: { query: string, data?: AnalysisItem, loading: boolean, isWaiting: boolean, error?: boolean, index: number, docId: string, brandDomain: string, onRetry: () => void }) => {
  const [expanded, setExpanded] = useState(false);
  const [showFullAnswer, setShowFullAnswer] = useState(false);
  const [recs, setRecs] = useState<string[]>([]);
  const [isGeneratingRecs, setIsGeneratingRecs] = useState(false);

  useEffect(() => {
    if (data?.recommendations) {
      setRecs(data.recommendations);
    }
  }, [data?.recommendations]);

  const handleGenerateRecs = async () => {
    setIsGeneratingRecs(true);
    try {
      const res = await api.generateRecommendations(docId, index);
      if (res.response === 'success') {
        setRecs(res.data);
      }
    } catch (err) {
      console.error('Failed to generate recommendations', err);
    } finally {
      setIsGeneratingRecs(false);
    }
  };

  const isMatchedDomain = (source: string) => {
    try {
      const domain = brandDomain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      return source.toLowerCase().includes(domain.toLowerCase());
    } catch {
      return false;
    }
  };

  const renderStatusIcon = () => {
    if (loading) return <Loader2 className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 animate-spin flex-shrink-0" />;
    if (isWaiting) return <Clock className="w-5 h-5 md:w-6 md:h-6 text-gray-300 flex-shrink-0" />;
    if (error) return <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-amber-500 flex-shrink-0" />;
    if (data) {
      return data.is_visible ? (
        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-500 flex-shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red-500 flex-shrink-0" />
      );
    }
    return <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-gray-200 flex-shrink-0" />;
  };

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all bg-white ${isWaiting ? 'opacity-50 border-gray-100 grayscale hover:grayscale-0 cursor-not-allowed' : 'border-gray-100 hover:border-indigo-200 shadow-sm'}`}>
      <div
        className={`p-4 md:p-6 flex items-start justify-between cursor-pointer transition-colors ${expanded ? 'bg-indigo-50/20' : 'hover:bg-gray-50/50'}`}
        onClick={() => !isWaiting && setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4 flex-grow">
          <div className="mt-1">{renderStatusIcon()}</div>
          <span className={`text-base md:text-lg font-bold leading-tight ${loading || isWaiting ? 'text-gray-400' : 'text-gray-700'}`}>
            {loading ? 'Analyzing: ' : isWaiting ? 'Queued: ' : ''} "{query}"
          </span>
        </div>
        {!isWaiting && (
          <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${expanded ? 'rotate-180 text-indigo-600' : ''}`} />
        )}
        {isWaiting && (
          <span className="hidden sm:inline-block text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 px-3 py-1 rounded-full flex-shrink-0 ml-4">In Queue</span>
        )}
      </div>

      {expanded && (
        <div className="p-5 md:p-8 border-t border-gray-100 bg-white animate-in slide-in-from-top-2 duration-300">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              <p className="text-gray-500 font-black uppercase tracking-widest text-sm">Analyzing this query...</p>
            </div>
          ) : error ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
              <Info className="w-10 h-10 text-gray-400" />
              <p className="text-gray-500 font-bold">Analysis unavailable for this query.</p>
              <button
                onClick={(e) => { e.stopPropagation(); onRetry(); }}
                className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-black text-xs uppercase tracking-widest border border-indigo-100 hover:bg-indigo-100 transition-all"
              >
                Retry Analysis
              </button>
            </div>
          ) : data ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatusBox icon={<Eye className="w-4 h-4" />} label="Brand Visible" value={data.is_visible ? 'Yes' : 'No'} success={data.is_visible} />
                <StatusBox icon={<CheckCircle2 className="w-4 h-4" />} label="Full Match" value={data.is_full_match ? 'Yes' : 'No'} success={data.is_full_match} />
                <StatusBox icon={<CheckCircle2 className="w-4 h-4" />} label="Partial Match" value={data.is_partial_match ? 'Yes' : 'No'} success={data.is_partial_match} />
                <StatusBox icon={<Trophy className="w-4 h-4" />} label="Rank" value={data.rank > 0 ? `#${data.rank}` : 'N/A'} bold />
                <StatusBox icon={<Hash className="w-4 h-4" />} label="Brand Mentions" value={data.mentions.toString()} bold />
                <StatusBox icon={<Hash className="w-4 h-4" />} label="Partial Mentions" value={data.num_partial_mentions.toString()} bold />
                <StatusBox icon={<Tag className="w-4 h-4" />} label="Partial Match Keyword" value={data.partial_match_keyword || 'None'} bold />
              </div>

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-xs">
                  <BrainCircuit className="w-4 h-4" /> AI Generated Answer
                </h4>
                <div className="relative bg-indigo-50/20 p-6 md:p-8 rounded-3xl border border-indigo-50 shadow-sm">
                  <div className={`markdown-content text-gray-600 leading-relaxed font-medium text-sm transition-all duration-500 overflow-hidden ${showFullAnswer ? 'max-h-[5000px]' : 'max-h-[4.5rem]'}`}>
                    <ReactMarkdown>{data.ai_answer}</ReactMarkdown>
                  </div>
                  {!showFullAnswer && data.ai_answer.length > 200 && (
                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-indigo-50/80 to-transparent pointer-events-none rounded-b-3xl" />
                  )}
                  <button
                    onClick={() => setShowFullAnswer(!showFullAnswer)}
                    className="mt-4 flex items-center gap-1.5 text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest"
                  >
                    {showFullAnswer ? <><ChevronUp className="w-3 h-3" /> Show Less</> : <>...read more <ChevronDown className="w-3 h-3" /></>}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-amber-600 font-black uppercase tracking-widest text-xs">
                  <Lightbulb className="w-4 h-4" /> Actionable Recommendations
                </h4>
                {recs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recs.map((rec, i) => (
                      <div key={i} className="bg-amber-50/40 p-4 md:p-6 rounded-2xl border border-amber-100 text-amber-900 font-medium text-xs flex gap-4 shadow-sm group hover:bg-amber-50 transition-colors leading-relaxed">
                        <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-amber-700 flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        {rec}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 md:p-12 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold text-sm mb-6 text-center">No recommendations available for this query.</p>
                    <button
                      onClick={handleGenerateRecs}
                      disabled={isGeneratingRecs}
                      className="flex items-center gap-2 px-6 md:px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:bg-gray-400 transition-all transform hover:-translate-y-0.5 active:scale-95"
                    >
                      {isGeneratingRecs ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Generate Recommendations
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-xs">
                  <Globe className="w-4 h-4" /> Information Sources
                </h4>
                <div className="flex flex-wrap gap-2 pt-2">
                  {data.sources && data.sources.length > 0 ? data.sources.map((source, i) => {
                    const isMatched = isMatchedDomain(source);
                    return (
                      <a
                        key={i}
                        href={`https://${source}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black tracking-wider uppercase border transition-all ${isMatched ? 'bg-indigo-600 text-white border-indigo-700 shadow-md shadow-indigo-100' : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'}`}
                      >
                        <ExternalLink className="w-3 h-3" /> {source}
                      </a>
                    );
                  }) : (
                    <p className="text-gray-400 font-bold text-xs italic">No specific sources cited.</p>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

interface Step3Props {
  brandInfo: BrandInput;
  queries: string[];
  docId: string;
  onReset: () => void;
  initialResults?: Record<number, AnalysisItem>;
}

const Step3Results: React.FC<Step3Props> = ({ brandInfo, queries, docId, onReset, initialResults }) => {
  const [results, setResults] = useState<Record<number, AnalysisItem>>(initialResults || {});
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
  const [errorStates, setErrorStates] = useState<Record<number, boolean>>({});
  const [analysisFinished, setAnalysisFinished] = useState(!!initialResults);
  const analysisStartedRef = useRef(false);

  const fetchQueryAnalysis = async (query: string, idx: number) => {
    if (results[idx]) return;
    setLoadingStates(prev => ({ ...prev, [idx]: true }));
    setErrorStates(prev => ({ ...prev, [idx]: false }));
    try {
      const response = await api.getQueryAnalysis({
        name: brandInfo.name,
        domain: brandInfo.domain,
        keywords: brandInfo.keywords,
        query: query,
        doc_id: docId,
        num_query: idx,
        total_queries: queries.length
      });
      if (response.response === 'success' && response.data) {
        setResults(prev => ({ ...prev, [idx]: response.data }));
      } else {
        setErrorStates(prev => ({ ...prev, [idx]: true }));
      }
    } catch (error) {
      console.error(`Error analyzing query ${idx}:`, error);
      setErrorStates(prev => ({ ...prev, [idx]: true }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [idx]: false }));
    }
  };

  useEffect(() => {
    if (initialResults || analysisStartedRef.current) return;
    let isMounted = true;
    analysisStartedRef.current = true;
    const promises = queries.map((query, i) => fetchQueryAnalysis(query, i));
    Promise.all(promises).then(() => {
      if (isMounted) setAnalysisFinished(true);
    });
    return () => { isMounted = false; };
  }, [queries, docId, brandInfo, initialResults]);

  const metrics = useMemo(() => {
    const items = Object.values(results);
    const totalCount = queries.length;
    if (items.length === 0) return { visibility: '0%', avgRank: '0', score: '0%', insights: '0' };
    const visibleCount = items.filter(i => i.is_visible).length;
    const rankedItems = items.filter(i => i.rank > 0);
    const totalRank = rankedItems.reduce((acc, i) => acc + i.rank, 0);
    const avgRank = rankedItems.length > 0 ? (totalRank / rankedItems.length).toFixed(1) : 'N/A';
    const totalScore = items.reduce((acc, i) => {
      let queryScore = 0;
      if (i.is_visible) {
        queryScore += 50;
        if (i.is_full_match) queryScore += 30;
        if (i.rank > 0 && i.rank <= 3) queryScore += 20;
        else if (i.rank > 3 && i.rank <= 10) queryScore += 10;
      }
      return acc + queryScore;
    }, 0);
    return {
      visibility: `${visibleCount}/${totalCount}`,
      avgRank: avgRank,
      score: `${Math.round(totalScore / totalCount)}%`,
      insights: items.reduce((acc, i) => acc + (i.recommendations?.length || 0), 0).toString()
    };
  }, [results, queries]);

  const GUIDE_LINK = "https://drive.google.com/file/d/11U3zct2IVYYrDQ_-scclEXMUR0g0Exeh/view?usp=sharing";

  return (
    <div className="space-y-12 animate-in fade-in duration-700 px-4 md:px-0">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Brand Visibility Analysis</h1>
        <p className="text-lg md:text-xl text-gray-500">
          Here's how <span className="text-indigo-600 font-bold">{brandInfo.name}</span> performs in AI search results
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={<Target className="w-6 h-6" />} label="AI Search Visibility" value={metrics.visibility} loading={loadingStates[0] && !results[0]} borderColor="border-indigo-500" shadowColor="shadow-indigo-100" accentColor="bg-indigo-50 text-indigo-600" />
        <MetricCard icon={<TrendingUp className="w-6 h-6" />} label="Average Ranking" value={metrics.avgRank !== 'N/A' ? `#${metrics.avgRank}` : 'N/A'} loading={loadingStates[0] && !results[0]} borderColor="border-blue-700" shadowColor="shadow-blue-100" accentColor="bg-blue-50 text-blue-700" />
        <MetricCard icon={<CheckCircle2 className="w-6 h-6" />} label="Visibility Score" value={metrics.score} loading={loadingStates[0] && !results[0]} borderColor="border-amber-400" shadowColor="shadow-amber-100" accentColor="bg-amber-50 text-amber-500" />
        <MetricCard icon={<Lightbulb className="w-6 h-6" />} label="Actionable Insights" value={metrics.insights} loading={loadingStates[0] && !results[0]} borderColor="border-orange-400" shadowColor="shadow-orange-100" accentColor="bg-orange-50 text-orange-400" />
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:border-indigo-200">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 flex-shrink-0">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-gray-900 leading-tight">Master AI Search Optimization</h3>
            <p className="text-gray-500 font-medium">Download the latest guide of ranking your brand in AI search results.</p>
          </div>
        </div>
        <a href={GUIDE_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-5 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all transform hover:-translate-y-1 active:scale-95 whitespace-nowrap">
          View Guide <Download className="w-5 h-5" />
        </a>
      </div>

      {!analysisFinished && (
        <div className="bg-indigo-600 text-white rounded-[1.5rem] p-6 flex items-center gap-4 shadow-xl animate-pulse">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-lg">In-Depth Analysis in Progress</p>
            <p className="text-indigo-100 font-medium text-sm">Once completed, a detailed copy of this investigation will be sent to your provided email address.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-gray-100 shadow-2xl shadow-indigo-100/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">Detailed Query Analysis</h2>
              <p className="text-gray-500 font-medium text-sm md:text-base">Breakdown of brand visibility for each search query.</p>
            </div>
          </div>
          <button onClick={onReset} className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-black text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all border-2 border-indigo-100">
            <RefreshCcw className="w-4 h-4" /> {initialResults ? 'Run New Analysis' : 'Restart Analysis'}
          </button>
        </div>

        <div className="space-y-4">
          {queries.map((query, idx) => (
            <AnalysisItemRow key={idx} index={idx} query={query} data={results[idx]} loading={loadingStates[idx]} isWaiting={!results[idx] && !loadingStates[idx] && !analysisStartedRef.current} error={errorStates[idx]} docId={docId} brandDomain={brandInfo.domain} onRetry={() => fetchQueryAnalysis(query, idx)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step3Results;
