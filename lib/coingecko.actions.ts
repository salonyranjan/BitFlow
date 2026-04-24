'use server';

import qs from 'query-string';
import React from 'react';

// --- 1. TYPE DEFINITIONS ---
export type OHLCData = [number, number, number, number, number];

export interface CoinDetailsData {
  id: string;
  name: string;
  symbol: string;
  asset_platform_id: string | null;
  detail_platforms: Record<string, { 
    geckoterminal_url: string; 
    contract_address: string; 
  }>;
  image: { small: string; large: string; thumb: string };
  market_cap_rank: number;
  description: { en: string }; 
  tickers: any[];              
  links: {
    homepage: string[];
    blockchain_site: string[];
    subreddit_url: string; // Forced to string to satisfy local strict types
  };
  market_data: { 
    current_price: { [key: string]: number; usd: number };
    price_change_24h_in_currency: { [key: string]: number; usd: number };
    price_change_percentage_24h_in_currency: { [key: string]: number; usd: number };
    price_change_percentage_30d_in_currency: { [key: string]: number; usd: number };
    market_cap: { [key: string]: number; usd: number };
    total_volume: { [key: string]: number; usd: number };
  };
}

export interface PoolData {
  id: string;
  address: string;
  name: string;
  network: string;
}

export interface NextPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface QueryParams {
  vs_currency?: string;
  days?: string | number;
  [key: string]: any; 
}

const BASE_URL = "https://api.coingecko.com/api/v3"; 
const API_KEY = process.env.COINGECKO_API_KEY;

if (!API_KEY) throw new Error('COINGECKO_API_KEY is missing.');

// --- 2. THE FETCHER ---
export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60,
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const sanitizedParams = { ...params };
  if (cleanEndpoint.includes('/ohlc')) {
    delete sanitizedParams.interval;
    delete sanitizedParams.precision;
  }

  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}${cleanEndpoint}`,
      query: sanitizedParams,
    },
    { skipEmptyString: true, skipNull: true }
  );

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-cg-demo-api-key': API_KEY!,
      'Accept': 'application/json',
    },
    next: { revalidate },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    console.error(`[BitFlow Pro Error] ${response.status}: ${url}`);
    throw new Error(`API Error: ${response.status}: ${errorBody.error || response.statusText}`);
  }

  const data = await response.json();

  // Normalize nulls to strings for TypeScript strict mode
  if (data?.links && data.links.subreddit_url === null) {
    data.links.subreddit_url = "";
  }

  return data as T;
}

export async function getPools(id: string): Promise<PoolData> {
  const fallback: PoolData = { id: '', address: '', name: '', network: '' };
  try {
    const res = await fetcher<{ data: any[] }>('onchain/search/pools', { query: id });
    const pool = res.data?.[0];
    return pool ? {
      id: pool.id,
      address: pool.attributes?.address || '',
      name: pool.attributes?.name || '',
      network: pool.id.split('_')[0] || 'unknown',
    } : fallback;
  } catch {
    return fallback;
  }
}