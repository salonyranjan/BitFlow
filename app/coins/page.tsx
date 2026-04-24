import { fetcher } from '@/lib/coingecko.actions';
import Image from 'next/image';
import Link from 'next/link';

import { cn, formatPercentage, formatCurrency } from '@/lib/utils';
import DataTable from '@/components/DataTable';
import CoinsPagination from '@/components/CoinsPagination';

const Coins = async ({ searchParams }: NextPageProps) => {
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;
  const perPage = 15; // Increased slightly for better screen fill

  const coinsData = await fetcher<CoinMarketData[]>('/coins/markets', {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: perPage,
    page: currentPage,
    sparkline: 'false',
    price_change_percentage: '24h',
  });

  const columns: DataTableColumn<CoinMarketData>[] = [
    {
      header: 'Rank',
      cellClassName: 'rank-cell text-zinc-500 font-mono text-xs',
      cell: (coin) => (
        <span className="opacity-50 group-hover:opacity-100 transition-opacity">
          #{coin.market_cap_rank}
        </span>
      ),
    },
    {
      header: 'Token',
      cellClassName: 'token-cell',
      cell: (coin) => (
        <Link href={`/coins/${coin.id}`} className="group/link flex items-center gap-4">
          <div className="relative">
             <div className="absolute -inset-1 bg-cyan-500/20 rounded-full blur opacity-0 group-hover/link:opacity-100 transition duration-500" />
             <Image 
                src={coin.image} 
                alt={coin.name} 
                width={32} 
                height={32} 
                className="relative rounded-full grayscale-[0.5] group-hover/link:grayscale-0 transition-all"
             />
          </div>
          <div>
            <p className="text-sm font-bold text-white group-hover/link:text-cyan-400 transition-colors">
              {coin.name}
            </p>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-tight">
              {coin.symbol}
            </p>
          </div>
        </Link>
      ),
    },
    {
      header: 'Price',
      cellClassName: 'price-cell font-mono font-bold text-sm',
      cell: (coin) => formatCurrency(coin.current_price),
    },
    {
      header: '24h Change',
      cellClassName: 'change-cell',
      cell: (coin) => {
        const isTrendingUp = coin.price_change_percentage_24h > 0;

        return (
          <span
            className={cn('text-xs font-black tracking-tighter px-2 py-1 rounded-md border', {
              'text-emerald-400 bg-emerald-500/5 border-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.1)]': isTrendingUp,
              'text-rose-400 bg-rose-500/5 border-rose-500/10 shadow-[0_0_10px_rgba(244,63,94,0.1)]': !isTrendingUp,
            })}
          >
            {isTrendingUp && '+'}
            {formatPercentage(coin.price_change_percentage_24h)}
          </span>
        );
      },
    },
    {
      header: 'Market Cap',
      cellClassName: 'market-cap-cell text-zinc-400 font-medium text-xs',
      cell: (coin) => formatCurrency(coin.market_cap),
    },
  ];

  const hasMorePages = coinsData.length === perPage;
  const estimatedTotalPages = 100;

  return (
    <main id="coins-page" className="p-4 lg:p-8 max-w-[1600px] mx-auto min-h-screen bg-[#030303]">
      <div className="relative space-y-8">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex justify-between items-end border-b border-white/5 pb-6">
           <div>
              <h4 className="text-3xl font-black uppercase tracking-tighter text-white">
                Market <span className="text-cyan-400">Directory</span>
              </h4>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">
                Real-time asset index // BitFlow Intelligence
              </p>
           </div>
           <div className="text-right hidden md:block">
              <span className="text-[10px] text-zinc-500 font-mono">STATUS: UPLINK_STABLE</span>
           </div>
        </div>

        <div className="relative group">
          {/* Subtle Outer Neon Border */}
          <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-2xl pointer-events-none" />
          
          <div className="bg-zinc-950/40 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
            <DataTable
              tableClassName="w-full"
              columns={columns}
              data={coinsData}
              rowKey={(coin) => coin.id}
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <CoinsPagination
            currentPage={currentPage}
            totalPages={estimatedTotalPages}
            hasMorePages={hasMorePages}
          />
        </div>
      </div>
    </main>
  );
};

export default Coins;