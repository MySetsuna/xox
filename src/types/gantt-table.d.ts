import { ColumnPinningState, HeaderGroup, Row } from '@tanstack/react-table';
import { Virtualizer } from '@tanstack/react-virtual';
export type GanttTableProps<T = unknown> = {
  rows: Row<T>[];
  headerGroups: HeaderGroup<T>[];
  columns: ColumnDef<T>[];
  headerHeight: number[];
  scrollWidth: number;
  boxHeight: number;
  rowHeight: number;
  totalHeaderHeight: number;
  visibleBodyHeight: number;
  groupGap: number;
  scrollTotalHeight: number;
  scrollBodyHeight: number;
  columnPinning?: ColumnPinningState;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
};
