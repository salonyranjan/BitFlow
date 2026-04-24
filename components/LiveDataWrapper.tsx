'use client';

import React, { useState, useMemo } from 'react';
import CandlestickChart from '@/components/CandlestickChart';
import DataTable from '@/components/DataTable';
import CoinHeader from '@/components/CoinHeader';
import { useCoinGeckoWebSocket } from '@/hooks/useCoinGeckoWebSocket';
import { formatCurrency, timeAgo } from '@/lib/utils';

interface LiveDataProps {
  coinId: string;
  poolId: string;
  coin: any; 
  coinOHLCData: any[];
}

const LiveDataWrapper = ({ coinId, poolId, coin, coinOHLCData }: LiveDataProps) => {
  const [liveInterval, setLiveInterval] = useState<'1s' | '1m'>('1s');
  
  const { 
    trades: liveTrades = [], 
    ohlcv, 
    price 
  } = useCoinGeckoWebSocket({ coinId, poolId, liveInterval });

  // 1. Populate table with historical tickers so it's never empty
  const initialTrades = useMemo(() => {
    return (coin.tickers || []).slice(0, 10).map((ticker: any) => ({
      price: ticker.last,
      amount: ticker.volume,
      value: ticker.last * ticker.volume,
      type: 'b',
      timestamp: ticker.last_traded_at,
    }));
  }, [coin.tickers]);

  // 2. Combine for display
  const displayTrades = useMemo(() => {
    return [...liveTrades, ...initialTrades].slice(0, 15);
  }, [liveTrades, initialTrades]);

  const tradeColumns = [
    { 
      header: 'Price', 
      cell: (t: any) => <span className="text-white font-medium">{formatCurrency(t.price)}</span> 
    },
    { 
      header: 'Amount', 
      cell: (t: any) => <span className="text-zinc-400">{t.amount?.toFixed(4)}</span> 
    },
    { 
      header: 'Value', 
      cell: (t: any) => <span className="text-zinc-400">{formatCurrency(t.value)}</span> 
    },
    { 
      header: 'Side', 
      cell: (t: any) => (
        <span className={t.type === 'b' ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
          {t.type === 'b' ? 'BUY' : 'SELL'}
        </span>
      ) 
    },
    { 
      header: 'Time', 
      cell: (t: any) => <span className="text-zinc-500 text-xs">{timeAgo(t.timestamp)}</span> 
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Header Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <CoinHeader
          name={coin.name}
          image={coin.image.large}
          livePrice={price?.usd ?? coin.market_data.current_price.usd}
          livePriceChangePercentage24h={
            price?.change24h ?? coin.market_data.price_change_percentage_24h_in_currency.usd
          }
          priceChangePercentage30d={coin.market_data.price_change_percentage_30d_in_currency.usd}
          priceChange24h={coin.market_data.price_change_24h_in_currency.usd}
        />
      </div>

      {/* 2. Chart Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm min-h-[500px] w-full overflow-hidden">
        <CandlestickChart
          coinId={coinId}
          data={coinOHLCData}
          liveOhlcv={ohlcv}
          mode="live"
          initialPeriod="daily"
        >
          <h4 className="text-lg font-bold text-white mb-4">Price Trend</h4>
        </CandlestickChart>
      </div>

      {/* 3. Trades Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl w-full overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h4 className="text-xl font-bold text-white">Recent Trades</h4>
          <span className="flex items-center gap-2 text-[10px] text-green-500 font-mono">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> LIVE
          </span>
        </div>
        
        <div className="w-full overflow-x-auto min-h-[300px]">
          <DataTable
            columns={tradeColumns}
            data={displayTrades}
            rowKey={(_, index: number) => index} // Explicit index type fix
            tableClassName="w-full text-left"
          />
        </div>
      </div>
    </div>
  );
};

export default LiveDataWrapper;