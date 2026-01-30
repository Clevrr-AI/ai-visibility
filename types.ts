
export interface BrandInput {
  name: string;
  domain: string;
  keywords: string;
}

export interface UserContact {
  email: string;
}

export interface GenerateQueriesResponse {
  response: 'success' | 'error';
  data: string[] | { message: string };
  doc_id: string; // Required for verification and analysis
  time_taken?: number;
}

export interface AnalysisItem {
  query: string;
  ai_answer: string;
  sources: string[];
  is_visible: boolean;
  is_full_match: boolean;
  is_partial_match: boolean;
  partial_match_keyword: string;
  rank: number;
  mentions: number;
  num_partial_mentions: number;
  recommendations: string[];
}

export interface ReportData {
  analysis: AnalysisItem[];
  created_at: any;
  created_by: string;
  domain: string;
  keywords: string;
  name: string;
}

export interface GetAnswerResponse {
  response: 'success' | 'error';
  data: AnalysisItem;
  time_taken: number;
}

export interface SendOtpResponse {
  response: 'success' | 'error';
  message?: string;
  error?: string;
}

export interface VerifyOtpParams {
  email: string;
  otp: number;
  brand: string;
  domain: string;
  keywords: string[];
  queries: string[];
  doc_id: string;
}

export interface GetAnswerParams {
  name: string;
  domain: string;
  keywords: string;
  query: string;
  doc_id: string;
  num_query: number;
  total_queries: number;
}
