import { GanttTableProps } from '@/types';
import { Row, flexRender } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import classNames from 'classnames';
import { useRef } from 'react';

export const GanttTable = (props: GanttTableProps) => {
  const {
    rows,
    headerGroups,
    headerHeight,
    scrollHeight,
    scrollWidth,
    rowHeight,
    totalHeaderHeight,
    bodyHeight,
    visibleBodyHeight,
    columns,
    groupGap = 0,
    boxHeight,
    columnPinning = {},
  } = props;
  const tableBoxRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableBoxRef.current,
    estimateSize: () => {
      // const row = rows[index];
      return rowHeight;
    },
    overscan: 10,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: columns.length,
    getScrollElement: () => tableBoxRef.current,
    estimateSize: (index) => columns[index].size ?? 200,
    overscan: 5,
  });

  return (
    <div
      className={classNames(
        'overflow-auto w-full scrollbar scrollbar-hide-y',
        'gantt-scroll',
        'gantt-table',
      )}
      ref={tableBoxRef}
      style={{ height: boxHeight }}
    >
      <div
        className={classNames('gantt-table-container')}
        style={{ height: scrollHeight, width: `max(${scrollWidth}px, 100%)` }}
      >
        <div className="gantt-table-header flex sticky top-0 z-10 flex-col bg-white">
          {headerGroups.map((headerGroup, index) => {
            const height =
              headerHeight?.[index] || headerHeight?.[0] || rowHeight;
            return (
              <div key={headerGroup.id} className={'flex'} style={{ height }}>
                {headerGroup.headers.map((header) => {
                  const isLeft = columnPinning.left?.includes(header.column.id);
                  const isRight = columnPinning.right?.includes(
                    header.column.id,
                  );
                  return (
                    <div
                      key={header.id}
                      className={'flex overflow-hidden sticky'}
                      style={{
                        width: header.getSize(),
                        left: isLeft ? header.getStart() : 'unset',
                        right: isRight
                          ? scrollWidth - header.getStart() - header.getSize()
                          : 'unset',
                        marginLeft: isRight ? 'auto' : 'unset',
                        background: isLeft || isRight ? 'white' : 'unset',
                        zIndex: isLeft || isRight ? 99 : 'unset',
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div
          className={classNames('gantt-table-body', 'relative  z-0')}
          style={{
            height: `max(${bodyHeight}px, ${visibleBodyHeight}px)`,
            transform: `translateY(${totalHeaderHeight}px)`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
            const row = rows[virtualRow.index] as Row<(typeof rows)[0]>;
            const isGroupRow = row.getIsGrouped();

            return (
              <div
                key={row.id}
                style={{
                  height: `${virtualRow.size}px`,
                  // transform: `translateY(${virtualRow.start}px)`,
                  borderTop: isGroupRow ? '1px solid black' : '',
                  borderBottom: '1px solid black',
                  transform: `translateY(${
                    virtualRow.start - index * virtualRow.size
                  }px)`,
                  marginTop: isGroupRow ? groupGap : 'unset',
                }}
                className="flex w-full"
              >
                {columnVirtualizer.getVirtualItems().map((virtualColumn) => {
                  const cells = row.getVisibleCells();
                  const cell = cells[virtualColumn.index];

                  const isLeft = columnPinning.left?.includes(cell.column.id);
                  const isRight = columnPinning.right?.includes(cell.column.id);
                  return (
                    <div
                      key={cell.id}
                      style={{
                        width: virtualColumn.size,
                        left: isLeft ? virtualColumn.start : 'unset',
                        right: isRight
                          ? scrollWidth -
                            virtualColumn.start -
                            virtualColumn.size
                          : 'unset',
                        marginLeft: isRight ? 'auto' : 'unset',
                        background: isLeft || isRight ? 'white' : 'unset',
                        zIndex: isLeft || isRight ? 99 : 'unset',
                      }}
                      className="sticky "
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
