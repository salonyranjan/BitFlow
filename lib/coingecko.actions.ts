'use server';

import qs from 'query-string';

// Types (Add these if missing)
export type OHLCData = [number, number, number, number, number];
export interface CoinDetailsData {
  name: string;
  symbol: string;
  image: { large: string };
  market_data: { current_price: { usd: number } };
}

const BASE_URL = "https://api.coingecko.com/api/v3"; // Demo Root
const API_KEY = process.env.COINGECKO_API_KEY;

export async function fetcher<T>(
  endpoint: string,
  params?: Record<string, any>,
  revalidate = 60,
): Promise<T> {
  if (!API_KEY) throw new Error('COINGECKO_API_KEY is missing');

  // Sanitize endpoint to prevent v3//path
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
      'x-cg-demo-api-key': API_KEY, // Use DEMO header
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