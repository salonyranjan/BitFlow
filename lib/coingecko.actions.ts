'use server';

import qs from 'query-string';
import React from 'react';

// --- 1. TYPE DEFINITIONS ---
export type OHLCData = [number, number, number, number, number];

export interface DataTableColumn<T> {
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  headClassName?: string;
  cellClassName?: string;
}

export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
}

export interface NextPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface CoinDetailsData {
  id: string;
  name: string;
  symbol: string;
  image: { large: string };
  market_data: { 
    current_price: { usd: number };
  };
}

export interface PoolData {
  id: string;
  address: string;
  name: string;
  network: string;
}

export interface QueryParams {
  vs_currency?: string;
  days?: string | number;
  [key: string]: any; 
}

// --- 2. CONFIGURATION ---
const BASE_URL = "https://api.coingecko.com/api/v3"; 
const API_KEY = process.env.COINGECKO_API_KEY;

if (!API_KEY) throw new Error('COINGECKO_API_KEY is missing.');

// --- 3. SERVER ACTIONS ---

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60,
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}${cleanEndpoint}`,
      query: params,
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

  return response.json();
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