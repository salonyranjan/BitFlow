import React from 'react';
import { fetcher } from '@/lib/coingecko.actions';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { CoinOverviewFallback } from './fallback';
import CandlestickChart from '@/components/CandlestickChart';

// Define the missing types locally or import them
interface CoinDetailsData {
  name: string;
  symbol: string;
  image: { large: string };
  market_data: { current_price: { usd: number } };
}

type OHLCData = [number, number, number, number, number];

const CoinOverview = async () => {
  try {
    const [coin, coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>('coins/bitcoin', {
        localization: false,
        tickers: false,
        community_data: false,
        developer_data: false,
        sparkline: false,
      }),
      fetcher<OHLCData[]>('coins/bitcoin/ohlc', {
        vs_currency: 'usd',
        days: 1, 
        precision: 'full',
        // REMOVED: interval: 'hourly'
        // REASON: For days=1, CoinGecko Pro defaults to 30-min data.
        // Forcing 'hourly' on a 1-day range triggers a 400 Bad Request.
      }),
    ]);

    return (
      <div id="coin-overview" className="w-full">
        <CandlestickChart data={coinOHLCData} coinId="bitcoin">
          <div className="header flex items-center gap-4 pt-4 px-4">
            <Image 
              src={coin.image.large} 
              alt={coin.name} 
              width={56} 
              height={56} 
              className="rounded-full"
            />
            <div className="info">
              <p className="text-sm font-medium text-muted-foreground">
                {coin.name} / {coin.symbol.toUpperCase()}
              </p>
              <h1 className="text-3xl font-bold tracking-tight">
                {formatCurrency(coin.market_data.current_price.usd)}
              </h1>
            </div>
          </div>
        </CandlestickChart>
      </div>
    );
  } catch (error) {
    console.error('Error fetching coin overview:', error);
    return <CoinOverviewFallback />;
  }
};

export default CoinOverview;