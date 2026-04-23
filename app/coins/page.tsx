import React from 'react';
import { fetcher, getPools, type OHLCData, type CoinDetailsData, type NextPageProps } from '@/lib/coingecko.actions';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

const Page = async ({ params }: NextPageProps) => {
  // NEXT.JS 16 FIX: Must await params
  const { id } = await params;

  try {
    /**
     * SURGICAL FIX: 
     * We removed 'interval' and 'precision' parameters.
     * The Demo API automatically provides the correct granularity for days=1.
     * Including extra params causes the 400 "invalid interval" error.
     */
    const [coin, ohlc, pools] = await Promise.all([
      fetcher<CoinDetailsData>(`coins/${id}`, {
        localization: false,
        tickers: false,
      }),
      fetcher<OHLCData[]>(`coins/${id}/ohlc`, { 
        vs_currency: 'usd', 
        days: 1 
      }), 
      getPools(id),
    ]);

    return (
      <main className="main-container py-10">
        <section className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={coin.image.large} 
                alt={coin.name} 
                className="h-12 w-12 rounded-full ring-2 ring-border/50" 
              />
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                {coin.name} <span className="text-muted-foreground font-light">{coin.symbol}</span>
              </h1>
            </div>
            <div className="text-right font-mono">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Live Price</p>
              <p className="text-2xl font-bold text-green-500">
                {formatCurrency(coin.market_data.current_price.usd)}
              </p>
            </div>
          </div>

          {/* Terminal Visualization Placeholder */}
          <div className="relative h-[400px] w-full rounded-2xl border border-dashed border-border bg-muted/5 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
             <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground animate-pulse">
                Terminal Sync: {ohlc.length} Candles Active
             </p>
          </div>

          {/* On-Chain Data */}
          {pools.address && (
            <div className="rounded-xl border border-border/40 bg-card/40 p-6 backdrop-blur-md">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4">On-Chain Terminal</h3>
              <p className="text-sm font-mono text-muted-foreground">
                Network: <span className="text-foreground">{pools.network}</span>
              </p>
              <p className="text-sm font-mono text-muted-foreground">
                Contract: <span className="text-primary truncate block md:inline">{pools.address}</span>
              </p>
            </div>
          )}
        </section>
      </main>
    );
  } catch (error) {
    console.error("[BitFlow Terminal Error]:", error);
    return (
      <div className="main-container py-20 text-center">
        <h2 className="text-xl font-black uppercase text-red-500">Connection Failed</h2>
        <p className="text-xs text-muted-foreground mt-2 uppercase tracking-tighter">
          The terminal could not synchronize with the market data stream.
        </p>
        <Link href="/" className="mt-8 inline-block text-[10px] font-black uppercase tracking-widest border-b border-primary text-primary pb-1">
          Return to Dashboard
        </Link>
      </div>
    );
  }
};

export default Page;