import { ColumnDef, HeaderGroup } from '@tanstack/react-table';

type GanttProps<T = unknown> = {
  columns: ColumnDef<T>[];
  headerGroups: HeaderGroup<T>[];
};

export const Gantt = (props: GanttProps) => {
  return <div>{JSON.stringify(props.columns)}</div>;
};
