'use server';

import qs from 'query-string';

// --- TYPES ---
export type OHLCData = [number, number, number, number, number];

export interface CurrencyMap {
  usd: number;
  [key: string]: number;
}

export interface CoinDetailsData {
  id: string;
  name: string;
  symbol: string;
  asset_platform_id: string | null;
  detail_platforms: Record<string, { geckoterminal_url: string; contract_address: string }>;
  image: { large: string; small: string; thumb: string };
  market_cap_rank: number;
  description: { en: string };
  tickers: any[];
  links: {
    homepage: string[];
    blockchain_site: string[];
    subreddit_url: string; 
  };
  market_data: {
    current_price: CurrencyMap;
    market_cap: CurrencyMap;
    total_volume: CurrencyMap;
    price_change_24h_in_currency: CurrencyMap;
    price_change_percentage_24h_in_currency: CurrencyMap;
    price_change_percentage_30d_in_currency: CurrencyMap;
  };
}

export interface PoolData {
  id: string;
  address: string;
  name: string;
  network: string;
}

const BASE_URL = "https://api.coingecko.com/api/v3";
const API_KEY = process.env.COINGECKO_API_KEY;

// --- FETCHER ---
export async function fetcher<T>(endpoint: string, params?: any): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let sanitizedParams = { ...params };

  // Strict whitelist for OHLC to stay compliant with Demo API
  if (cleanEndpoint.includes('/ohlc')) {
    sanitizedParams = {
      vs_currency: params.vs_currency || 'usd',
      days: params.days || '1',
    };
  }

  const url = qs.stringifyUrl(
    { url: `${BASE_URL}${cleanEndpoint}`, query: sanitizedParams },
    { skipEmptyString: true, skipNull: true }
  );

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'x-cg-demo-api-key': API_KEY || '', 'Accept': 'application/json' },
    next: { revalidate: 60 },
  });

  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  const data = await response.json();

  // Normalize null subreddit_url to string for TS safety
  if (data?.links && data.links.subreddit_url === null) {
    data.links.subreddit_url = "";
  }

  return data as T;
}

// --- POOL RESOLUTION ---
export async function getPools(id: string, platformId?: string | null, contract?: string | null): Promise<PoolData | null> {
  const networkMap: Record<string, string> = {
    'ethereum': 'eth',
    'binance-smart-chain': 'bsc',
    'polygon-pos': 'polygon',
    'arbitrum-one': 'arbitrum',
    'base': 'base',
    'solana': 'solana'
  };

  const networkSlug = platformId ? (networkMap[platformId] || platformId) : null;

  try {
    if (networkSlug && contract && networkSlug !== 'tokens') {
      const res = await fetcher<{ data: any[] }>(`/onchain/networks/${networkSlug}/tokens/${contract}/pools`);
      if (res.data?.[0]) {
        return {
          id: res.data[0].id,
          address: res.data[0].attributes.address,
          name: res.data[0].attributes.name,
          network: networkSlug
        };
      }
    }
    const search = await fetcher<{ data: any[] }>(`onchain/search/pools`, { query: id });
    const pool = search.data?.[0];
    return pool ? {
      id: pool.id,
      address: pool.attributes.address,
      name: pool.attributes.name,
      network: pool.id.split('_')[0]
    } : null;
  } catch { return null; }
}