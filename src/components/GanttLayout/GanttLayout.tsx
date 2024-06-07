/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { WEEKDAY_MAP, buildGanttHeader } from '@/uitls/gantt';
import { Dayjs } from 'dayjs';
import { GanttLayoutProps } from '@/types';
import { GanttMode } from '@/lib/module';
import { Gantt } from '../Gantt/Gantt';

type T = GanttLayoutProps['data'][0];

const headerRenderer = {
  date: (date: Dayjs) => {
    return () => {
      const day = date.get('day');
      const dateStr = date.format('D');
      return (
        <div
          title={date.format('YYYY-MM-DD')}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            whiteSpace: 'nowrap',
            padding: '0 5px',
          }}
        >
          <span>{dateStr}</span>
          <span>{WEEKDAY_MAP[day]}</span>
        </div>
      );
    };
  },
  month: (date: Dayjs) => {
    return () => {
      const month = date.get('month');
      if (!month) {
        return date.format('YYYY年M月');
      }
      return date.format('M月');
    };
  },
  week: (date: Dayjs) => {
    return () => {
      // const end = date.add(6, 'day');
      // const format =
      //   end.get('year') !== date.get('year') ? 'YYYY-MM-DD' : 'MM-DD';

      // return (
      //   `${date.locale(timezone).weekYear()}年` +
      //   ' ' +
      //   `${date.locale(timezone).week()}周 ` +
      //   `${date.format(format)}~${date.add(6, 'day').format(format)}`
      // );
      const month = date.get('month');
      if (!month) {
        return date.format('YYYY年M月D日');
      }
      return date.format('M月D日');
    };
  },
};

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
    // showAlert = false,
    // alertHeight = 0,
    tableColumnPinning,
    startAt,
    endAt,
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
    const ganttColumns: ColumnDef<T>[] = buildGanttHeader(
      GanttMode.MonthDay,
      startAt,
      endAt,
      headerRenderer,
      50,
      true,
    );
    return ganttColumns;
  }, [startAt, endAt]);

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
        <Gantt columns={ganttColumns} headerGroups={ganttHeaderGroups} />
      </ReactFlowProvider>
    </div>
  );
});
