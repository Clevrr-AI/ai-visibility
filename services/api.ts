
import { BrandInput, GenerateQueriesResponse, GetAnswerResponse, SendOtpResponse, VerifyOtpParams, GetAnswerParams, ReportData } from '../types';

const BASE_URL = 'https://141d09dfa02a.ngrok-free.app';

const HEADERS = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true'
};

export const api = {
  generateQueries: async (input: BrandInput): Promise<GenerateQueriesResponse> => {
    const response = await fetch(`${BASE_URL}/generate-queries`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error('Failed to generate queries');
    return response.json();
  },

  getQueryAnalysis: async (params: GetAnswerParams): Promise<GetAnswerResponse> => {
    const response = await fetch(`${BASE_URL}/get-answer`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error('Analysis request failed');
    return response.json();
  },

  getReport: async (doc_id: string): Promise<{ response: string; data: ReportData }> => {
    const response = await fetch(`${BASE_URL}/get-report?id=${doc_id}`, {
      method: 'GET',
      headers: HEADERS,
    });
    if (!response.ok) throw new Error('Failed to fetch report');
    return response.json();
  },

  generateRecommendations: async (id: string, index: number): Promise<{ response: string; data: string[] }> => {
    const response = await fetch(`${BASE_URL}/generate-recommendations`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ id, index }),
    });
    if (!response.ok) throw new Error('Failed to generate recommendations');
    return response.json();
  },

  sendOtp: async (email: string): Promise<SendOtpResponse> => {
    const response = await fetch(`${BASE_URL}/send-otp`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  verifyOtp: async (params: VerifyOtpParams): Promise<{ response: string; message?: string; error?: string }> => {
    const response = await fetch(`${BASE_URL}/verify-otp`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(params),
    });
    return response.json();
  },

  saveContact: async (email: string, brand: BrandInput): Promise<void> => {
    console.log('Lead synchronized with growth database:', {
      email,
      brand: brand.name,
      timestamp: new Date().toISOString()
    });
    return Promise.resolve();
  }
};
