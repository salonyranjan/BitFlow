import React from 'react';
import { 
  fetcher, 
  getPools, 
  type CoinDetailsData, 
  type OHLCData 
} from '@/lib/coingecko.actions';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import LiveDataWrapper from '@/components/LiveDataWrapper';
import Converter from '@/components/Converter';

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  const [coinData, coinOHLCData] = await Promise.all([
    fetcher<CoinDetailsData>(`/coins/${id}`, {
      localization: false,
      tickers: true,
      market_data: true,
    }),
    fetcher<OHLCData[]>(`/coins/${id}/ohlc`, {
      vs_currency: 'usd',
      days: 1, 
    }),
  ]);

  const platformId = coinData.asset_platform_id;
  const contract = platformId ? coinData.detail_platforms[platformId]?.contract_address : null;
  const pool = await getPools(id, platformId, contract);

  const coinDetails = [
    { label: 'Market Cap', value: formatCurrency(coinData.market_data.market_cap.usd) },
    { label: 'Market Cap Rank', value: `# ${coinData.market_cap_rank || 'N/A'}` },
    { label: 'Total Volume', value: formatCurrency(coinData.market_data.total_volume.usd) },
    { label: 'Website', link: coinData.links.homepage?.[0] || null, linkText: 'Homepage' },
    { label: 'Explorer', link: coinData.links.blockchain_site?.[0] || null, linkText: 'Explorer' },
    { label: 'Community', link: coinData.links.subreddit_url || null, linkText: 'Reddit' },
  ];

  return (
    <main className="p-4 lg:p-8 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
        
        {/* LEFT COLUMN: Fills remaining space */}
        <div className="w-full lg:flex-1 min-w-0">
          <LiveDataWrapper 
            coinId={id} 
            poolId={pool?.id || ''} 
            coin={coinData} 
            coinOHLCData={coinOHLCData ?? []} 
          />
        </div>

        {/* RIGHT COLUMN: Fixed Sidebar */}
        <aside className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0 lg:sticky lg:top-8">
          <Converter
            symbol={coinData.symbol}
            icon={coinData.image.large}
            priceList={coinData.market_data.current_price}
          />

          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl">
            <h4 className="text-xl font-bold mb-6 text-white border-b border-zinc-800 pb-3">
              Coin Details
            </h4>
            <ul className="flex flex-col gap-5">
              {coinDetails.map(({ label, value, link, linkText }, index) => (
                <li key={index} className="flex justify-between items-center text-sm gap-4">
                  <span className="text-zinc-400 font-medium whitespace-nowrap">{label}</span>
                  {link ? (
                    <Link 
                      href={link} 
                      target="_blank" 
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                    >
                      {linkText} <ArrowUpRight size={14} />
                    </Link>
                  ) : (
                    <span className="text-zinc-100 font-bold text-right">{value || 'N/A'}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Page;