import { ColumnPinningState, HeaderGroup, Row } from '@tanstack/react-table';
export type GanttTableProps<T = unknown> = {
  rows: Row<T>[];
  headerGroups: HeaderGroup<T>[];
  columns: ColumnDef<T>[];
  headerHeight: number[];
  scrollHeight: number;
  scrollWidth: number;
  rowHeight: number;
  totalHeaderHeight: number;
  bodyHeight: number;
  visibleBodyHeight: number;
  groupGap: number;
  boxHeight: number;
  columnPinning?:ColumnPinningState
};
