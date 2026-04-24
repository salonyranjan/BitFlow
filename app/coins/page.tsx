import { getCoinOHLC } from '@/lib/coingecko.actions';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ days?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  // 1. Await the promises (Required in Next.js 15+)
  const { id } = await params;
  const sParams = await searchParams;
  const days = sParams.days || '1';

  try {
    // 2. Use the dedicated helper that ONLY sends valid params
    const chartData = await getCoinOHLC(id, days);

    return (
      <div className="p-6">
        <h1>Market Data for {id}</h1>
        {/* Pass chartData to your Chart Component here */}
        <pre className="text-xs opacity-50">
            Data Points: {chartData.length}
        </pre>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="p-10 border border-red-500 bg-red-50/10 rounded-lg">
        <h2 className="text-red-500 font-bold">Failed to load chart data</h2>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }
}