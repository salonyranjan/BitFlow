import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const DataTable = <T,>({
  columns,
  data,
  rowKey,
  tableClassName,
  headerClassName,
  headerRowClassName,
  headerCellClassName,
  bodyRowClassName,
  bodyCellClassName,
}: DataTableProps<T>) => {
  return (
    <Table className={cn('custom-scrollbar', tableClassName)}>
      <TableHeader className={headerClassName}>
        <TableRow className={cn('hover:bg-transparent!', headerRowClassName)}>
          {columns.map((column, i) => (
            <TableHead
              key={i}
              className={cn(
                'bg-dark-400 text-purple-100 py-4 first:pl-5 last:pr-5',
                headerCellClassName,
                column.headClassName,
              )}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow
            key={rowKey(row, rowIndex)}
            className={cn(
              'overflow-hidden rounded-lg border-b border-purple-100/5 hover:bg-dark-400/30! relative',
              bodyRowClassName,
            )}
          >
            {columns.map((column, columnIndex) => (
              <TableCell
                key={columnIndex}
                className={cn('py-4 first:pl-5 last:pr-5', bodyCellClassName, column.cellClassName)}
              >
                {column.cell(row, rowIndex)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;