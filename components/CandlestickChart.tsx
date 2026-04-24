'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import {
  getCandlestickConfig,
  getChartConfig,
  PERIOD_BUTTONS,
  PERIOD_CONFIG,
} from '@/constants';
import { 
  CandlestickSeries, 
  createChart, 
  IChartApi, 
  ISeriesApi, 
  type Time,
  ColorType
} from 'lightweight-charts';
import { fetcher, type OHLCData } from '@/lib/coingecko.actions';

type Period = keyof typeof PERIOD_CONFIG;

interface CandlestickChartProps {
  children?: React.ReactNode;
  data: OHLCData[];
  coinId: string;
  height?: number;
  initialPeriod?: Period;
  liveOhlcv?: OHLCData | null;
  mode?: 'historical' | 'live';
}

const sanitizeOHLC = (rawData: OHLCData[]) => {
  if (!rawData || !Array.isArray(rawData) || rawData.length === 0) return [];

  const processed = rawData
    .map((item) => ({
      time: (Math.floor(item[0] / 1000)) as Time,
      open: item[1],
      high: item[2],
      low: item[3],
      close: item[4],
    }))
    .filter((item) => !isNaN(item.time as unknown as number) && item.open != null)
    .sort((a, b) => (a.time as unknown as number) - (b.time as unknown as number));

  return processed.filter((item, index, self) => 
    index === 0 || (item.time as unknown as number) > (self[index - 1].time as unknown as number)
  );
};

const CandlestickChart = ({
  children,
  data,
  coinId,
  height = 400, // Slightly taller
  initialPeriod = 'daily' as Period,
  liveOhlcv = null,
  mode = 'historical',
}: CandlestickChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
  const [isPending, startTransition] = useTransition();

  const fetchOHLCData = async (selectedPeriod: Period) => {
    try {
      const { days } = PERIOD_CONFIG[selectedPeriod];
      const newData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
        vs_currency: 'usd',
        days,
      });
      startTransition(() => {
        setOhlcData(newData ?? []);
      });
    } catch (e) {
      console.error('Fetch Error:', e);
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Explicit Chart Configuration for visibility
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { type: ColorType.Solid, color: '#09090b' }, // Matches zinc-950
        textColor: '#a1a1aa',
      },
      grid: {
        vertLines: { color: '#18181b' },
        horzLines: { color: '#18181b' },
      },
      timeScale: {
        borderColor: '#27272a',
        timeVisible: true,
      }
    });
    
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    const sanitized = sanitizeOHLC(ohlcData);
    
    if (sanitized.length > 0) {
      series.setData(sanitized);
      chart.timeScale().fitContent();
    } else {
      console.warn("No data points were valid after sanitization.");
    }

    chartRef.current = chart;
    candleSeriesRef.current = series;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [height, period, ohlcData.length === 0]); // Re-init if data was initially empty

  useEffect(() => {
    if (!candleSeriesRef.current) return;
    let combined = [...ohlcData];
    if (liveOhlcv) {
      const idx = combined.findIndex(d => d[0] === liveOhlcv[0]);
      idx !== -1 ? combined[idx] = liveOhlcv : combined.push(liveOhlcv);
    }
    const finalData = sanitizeOHLC(combined);
    if (finalData.length > 0) {
      candleSeriesRef.current.setData(finalData);
      if (mode === 'historical') chartRef.current?.timeScale().fitContent();
    }
  }, [ohlcData, liveOhlcv, mode]);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
        {children}
        <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800 self-end">
          {PERIOD_BUTTONS.map(({ value, label }) => (
            <button
              key={value}
              disabled={isPending}
              onClick={() => {
                const p = value as Period;
                setPeriod(p);
                fetchOHLCData(p);
              }}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                period === value ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Fallback for empty data */}
      {ohlcData.length === 0 && !isPending && (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-500 bg-zinc-950/50 rounded-xl border border-dashed border-zinc-800" style={{ height }}>
          No chart data available for this period.
        </div>
      )}

      {/* THE CONTAINER: Must have 'relative' and a defined height */}
      <div 
        ref={chartContainerRef} 
        className="w-full rounded-xl bg-zinc-950 border border-zinc-800 relative overflow-hidden" 
        style={{ height, minHeight: `${height}px` }} 
      />
    </div>
  );
};

export default CandlestickChart;