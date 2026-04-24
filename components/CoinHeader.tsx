import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp } from 'lucide-react';

// --- 1. DEFINE THE INTERFACE ---
interface LiveCoinHeaderProps {
  livePriceChangePercentage24h: number;
  priceChangePercentage30d: number;
  name: string;
  image: string;
  livePrice: number;
  priceChange24h: number;
}

const CoinHeader = ({
  livePriceChangePercentage24h = 0,
  priceChangePercentage30d = 0,
  name,
  image,
  livePrice = 0,
  priceChange24h = 0,
}: LiveCoinHeaderProps) => {
  // Logic for determining directions
  const isTrendingUp = livePriceChangePercentage24h > 0;
  const isThirtyDayUp = priceChangePercentage30d > 0;
  const isPriceChangeUp = priceChange24h > 0;

  const stats = [
    {
      label: 'Today',
      value: livePriceChangePercentage24h,
      isUp: isTrendingUp,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: '30 Days',
      value: priceChangePercentage30d,
      isUp: isThirtyDayUp,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: 'Price Change (24h)',
      value: priceChange24h,
      isUp: isPriceChangeUp,
      formatter: formatCurrency,
      showIcon: false,
    },
  ];

  return (
    <div id="coin-header" className="space-y-6">
      <h3 className="text-2xl font-bold text-white">{name}</h3>

      <div className="info flex items-center gap-6">
        {/* Using a relative container for Next.js Image if needed, or standard width/height */}
        <div className="relative overflow-hidden rounded-full border border-zinc-800 bg-zinc-900/50 p-2">
          <Image 
            src={image} 
            alt={name} 
            width={77} 
            height={77} 
            className="rounded-full"
          />
        </div>

        <div className="price-row flex flex-col gap-2">
          <h1 className="text-4xl font-black text-white tracking-tight">
            {formatCurrency(livePrice)}
          </h1>
          <Badge 
            variant="outline"
            className={cn(
              'badge flex items-center gap-1.5 w-fit px-3 py-1 text-sm font-semibold', 
              isTrendingUp 
                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                : 'bg-red-500/10 text-red-500 border-red-500/20'
            )}
          >
            {formatPercentage(livePriceChangePercentage24h)}
            {isTrendingUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span className="opacity-70">(24h)</span>
          </Badge>
        </div>
      </div>

      <ul className="stats grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-800 pt-6">
        {stats.map((stat) => (
          <li key={stat.label} className="flex flex-col gap-1">
            <p className="label text-xs uppercase tracking-widest text-zinc-500 font-bold">
              {stat.label}
            </p>

            <div
              className={cn('value flex items-center gap-2 text-lg font-bold', {
                'text-green-500': stat.isUp,
                'text-red-500': !stat.isUp,
              })}
            >
              <p>{stat.formatter(stat.value)}</p>
              {stat.showIcon &&
                (stat.isUp ? (
                  <TrendingUp width={16} height={16} />
                ) : (
                  <TrendingDown width={16} height={16} />
                ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoinHeader;