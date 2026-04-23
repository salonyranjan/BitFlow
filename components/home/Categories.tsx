import { fetcher } from '@/lib/coingecko.actions';
import DataTable from '@/components/DataTable';
import Image from 'next/image';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { CategoriesFallback } from './fallback';

const Categories = async () => {
  try {
    const categories = await fetcher<Category[]>('/coins/categories');

    const columns: DataTableColumn<Category>[] = [
      { header: 'Category', cellClassName: 'category-cell', cell: (category) => category.name },
      {
        header: 'Top Gainers',
        cellClassName: 'top-gainers-cell',
        cell: (category) =>
          category.top_3_coins.map((coin) => (
            <Image src={coin} alt={coin} key={coin} width={28} height={28} />
          )),
      },
      {
        header: '24h Change',
        cellClassName: 'change-header-cell',
        cell: (category) => {
          const isTrendingUp = category.market_cap_change_24h > 0;

          return (
            <div className={cn('change-cell', isTrendingUp ? 'text-green-500' : 'text-red-500')}>
              <p className="flex items-center">
                {formatPercentage(category.market_cap_change_24h)}
                {isTrendingUp ? (
                  <TrendingUp width={16} height={16} />
                ) : (
                  <TrendingDown width={16} height={16} />
                )}
              </p>
            </div>
          );
        },
      },
      {
        header: 'Market Cap',
        cellClassName: 'market-cap-cell',
        cell: (category) => formatCurrency(category.market_cap),
      },
      {
        header: '24h Volume',
        cellClassName: 'volume-cell',
        cell: (category) => formatCurrency(category.volume_24h),
      },
    ];

    return (
      <div id="categories" className="custom-scrollbar">
        <h4>Top Categories</h4>

        <DataTable
          columns={columns}
          data={categories?.slice(0, 10)}
          rowKey={(_, index) => index}
          tableClassName="mt-3"
        />
      </div>
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return <CategoriesFallback />;
  }
};

export default Categories;
