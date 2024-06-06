import { GanttLayoutProps } from '@/types';
import {
  useReactTable,
  Column,
  getCoreRowModel,
  ColumnPinningState,
  ColumnDef,
  getSortedRowModel,
} from '@tanstack/react-table';
import classNames from 'classnames';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { GanttTable } from '../GanttTable/GanttTable';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Resizable } from 're-resizable';
import { ReactFlowProvider } from 'reactflow';

type T = GanttLayoutProps['data'][0];

export const GanttLayout = memo((props: GanttLayoutProps) => {
  const {
    data,
    columns: tableColumns,
    style,
    className,
    headerHeight,
    rowHeight,
    overscan,
    groupGap = 0,
    isGroup,
    hasFirstGroupGap,
    hasLastGroupGap,
    lastGroupGap,
    showYearHeader = false,
    showAlert = false,
    alertHeight = 0,
    tableColumnPinning,
  } = props;
  const [tableWidth, setTableWidth] = useState(300);
  const boxHeight = 700;

  const scrollYBoxRef = useRef<HTMLDivElement>(null);

  const columnPinning = useMemo(() => {
    const tableColumnKeys = tableColumns.map<string>(({ id }) => id as string);
    return {
      left: tableColumnKeys,
      leftLeft: [],
    };
  }, [tableColumns]);

  const ganttColumns = useMemo(() => {
    const ganttColumns: ColumnDef<T>[] = [];
    return ganttColumns;
  }, []);

  const columns = useMemo(() => {
    return [...tableColumns, ...ganttColumns];
  }, [ganttColumns, tableColumns]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnPinning,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows, rowsById } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollYBoxRef.current,
    estimateSize: (index) => {
      const row = rows[index];
      if (isGroup) {
        return isGroup(row) && (hasFirstGroupGap || !!index)
          ? rowHeight + groupGap
          : rowHeight;
      }
      return row.groupingColumnId ? rowHeight + groupGap : rowHeight;
    },
    overscan,
  });

  const tableHeaderGroups = table.getLeftHeaderGroups();
  const ganttHeaderGroups = table.getCenterHeaderGroups();

  const visibleHeaderGroups = useMemo(
    () => ganttHeaderGroups.slice(showYearHeader ? 0 : 1),
    [showYearHeader, ganttHeaderGroups],
  );

  const leafHeaderGroupHeaders =
    visibleHeaderGroups[visibleHeaderGroups.length - 1]?.headers;

  // const totalHeaderHeight = useMemo(
  //   () =>
  //     visibleHeaderGroups.reduce((totalHeight, _headerGroup, index) => {
  //       const height = headerHeight?.[index] || headerHeight?.[0] || rowHeight;
  //       return totalHeight + height;
  //     }, 0) + (showAlert ? alertHeight : 0),
  //   [headerHeight, showAlert, alertHeight, rowHeight, visibleHeaderGroups],
  // );
  const totalHeaderHeight = 20;

  const visibleBodyHeight =
    (scrollYBoxRef.current?.clientHeight ?? 0) - totalHeaderHeight;

  const scrollBodyHeight = data.length * rowHeight;

  const scrollTotalHeight =
    scrollBodyHeight +
    totalHeaderHeight +
    (hasLastGroupGap ? lastGroupGap ?? groupGap : 0);

  console.log(totalHeaderHeight, 'totalHeaderHeight', scrollTotalHeight);

  const scrollWidth = table.getCenterTotalSize();
  const tableScrollWidth = table.getLeftTotalSize();

  return (
    <div
      className={classNames('flex h-full overflow-auto scrollbar', className)}
      style={{ ...style, height: boxHeight }}
      ref={scrollYBoxRef}
    >
      <ReactFlowProvider>
        <Resizable
          size={{ width: tableWidth, height: scrollTotalHeight }}
          onResize={(_e, _d, element) => setTableWidth(element.offsetWidth)}
          minWidth={100}
          maxWidth={'80%'}
          enable={{ right: true }}
        >
          <GanttTable
            totalHeaderHeight={totalHeaderHeight}
            rows={rows}
            columns={tableColumns}
            headerHeight={headerHeight}
            boxHeight={boxHeight}
            scrollWidth={tableScrollWidth}
            headerGroups={tableHeaderGroups}
            rowHeight={rowHeight}
            visibleBodyHeight={visibleBodyHeight}
            groupGap={groupGap}
            scrollBodyHeight={scrollBodyHeight}
            scrollTotalHeight={scrollTotalHeight}
            columnPinning={tableColumnPinning}
            rowVirtualizer={rowVirtualizer}
          />
        </Resizable>
      </ReactFlowProvider>
    </div>
  );
});
