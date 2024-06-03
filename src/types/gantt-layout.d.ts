import { CSSProperties } from 'react';
import { ColumnDef, ColumnPinningState } from '@tanstack/react-table';

export type GanttLayoutProps<T = unknown> = {
  data: T[];
  columns: ColumnDef<T>[];
  style?: CSSProperties;
  className?: string;
  showYearRow?: boolean;
  hasFirstGroupGap?: boolean;
  headerHeight: number[];
  rowHeight: number;
  overscan: number;
  groupGap?: number;
  lastGroupGap?: number;
  firstGroupGap?: number;
  isGroup?: (row: Row<T>) => boolean;
  hasLastGroupGap?: boolean;
  showYearHeader?: boolean;
  showAlert?: boolean;
  alertHeight?: number;
  tableColumnPinning?: ColumnPinningState;
};
