import React from 'react';
import { 
  fetcher, 
  getPools, 
  type CoinDetailsData, 
  type OHLCData, 
  type NextPageProps 
} from '@/lib/coingecko.actions';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import LiveDataWrapper from '@/components/LiveDataWrapper';
import Converter from '@/components/Converter';

const Page = async ({ params }: NextPageProps) => {
  const { id } = await params;

  // Fetching data with the corrected parameters
  const [coinData, coinOHLCData] = await Promise.all([
    fetcher<CoinDetailsData>(`/coins/${id}`, {
      localization: false,
      tickers: true,
      market_data: true,
    }),
    fetcher<OHLCData[]>(`/coins/${id}/ohlc`, {
      vs_currency: 'usd',
      days: 1, 
      // interval and precision removed to stay compliant with CoinGecko API
    }),
  ]);

  const pool = await getPools(id);

  const coinDetails = [
    {
      label: 'Market Cap',
      value: formatCurrency(coinData.market_data.market_cap.usd),
    },
    {
      label: 'Market Cap Rank',
      value: `# ${coinData.market_cap_rank || 'N/A'}`,
    },
    {
      label: 'Total Volume',
      value: formatCurrency(coinData.market_data.total_volume.usd),
    },
    {
      label: 'Website',
      value: '-',
      link: coinData.links.homepage[0],
      linkText: 'Homepage',
    },
    {
      label: 'Explorer',
      value: '-',
      link: coinData.links.blockchain_site[0],
      linkText: 'Explorer',
    },
    {
      label: 'Community',
      value: '-',
      link: coinData.links.subreddit_url,
      linkText: 'Community',
    },
  ];

  return (
    <main id="coin-details-page" className="p-4 lg:p-8">
      <section className="primary">
        <LiveDataWrapper 
          coinId={id} 
          poolId={pool.id} 
          coin={coinData} 
          coinOHLCData={coinOHLCData}
        >
          <h4 className="font-bold text-lg text-white mt-4">Exchange Listings</h4>
        </LiveDataWrapper>
      </section>

      <section className="secondary mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Converter
          symbol={coinData.symbol}
          icon={coinData.image.large}
          priceList={coinData.market_data.current_price}
        />

        <div className="details p-6 bg-zinc-900 rounded-xl border border-zinc-800">
          <h4 className="text-xl font-semibold mb-4 text-white">Coin Details</h4>
          <ul className="details-grid grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            {coinDetails.map(({ label, value, link, linkText }, index) => (
              <li key={index} className="flex flex-col">
                <p className="text-sm text-zinc-400">{label}</p>
                {link ? (
                  <div className="link flex items-center gap-1 text-blue-400 hover:text-blue-300">
                    <Link href={link} target="_blank" className="text-sm font-medium">
                      {linkText || label}
                    </Link>
                    <ArrowUpRight size={14} />
                  </div>
                ) : (
                  <p className="text-base font-medium text-zinc-100">{value}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default Page;