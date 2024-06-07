import { GanttTableProps } from '@/types';
import { Row, flexRender } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import ScrollMirror from 'scrollmirror';

export const GanttTable = (props: GanttTableProps) => {
  const {
    rows,
    headerGroups,
    headerHeight,
    scrollWidth,
    rowHeight,
    totalHeaderHeight,
    boxHeight,
    visibleBodyHeight,
    columns,
    groupGap = 0,
    scrollTotalHeight,
    scrollBodyHeight,
    columnPinning = {},
    rowVirtualizer,
  } = props;
  const tableBoxRef = useRef<HTMLDivElement>(null);
  const tableHeaderBoxRef = useRef<HTMLDivElement>(null);
  const tableScrollXBarBoxRef = useRef<HTMLDivElement>(null);

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: columns.length,
    getScrollElement: () => tableBoxRef.current,
    estimateSize: (index) => columns[index].size ?? 200,
    overscan: 5,
  });

  useEffect(() => {
    if (
      tableHeaderBoxRef.current &&
      tableBoxRef.current &&
      tableScrollXBarBoxRef.current
    ) {
      new ScrollMirror([
        tableHeaderBoxRef.current,
        tableBoxRef.current,
        tableScrollXBarBoxRef.current,
      ]);
    }
  }, []);

  return (
    <>
      <div
        className="gantt-table-header flex sticky top-0 z-10 flex-col bg-white overflow-x-auto scrollbar-hide-x"
        ref={tableHeaderBoxRef}
      >
        <div style={{ width: `max(${scrollWidth}px, 100%)` }}>
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
                  console.log(headerGroup,'headerGroup');
                  
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
      </div>
      <div
        className="sticky h-0 overflow-visible  z-[100]"
        style={{ top: boxHeight - 9 }}
      >
        <div
          className="gantt-table-scroll-x flex flex-col bg-white overflow-x-auto w-full scrollbar scrollbar-hide-y"
          ref={tableScrollXBarBoxRef}
        >
          <div
            style={{
              width: `max(${scrollWidth}px, 100%)`,
              height: 1,
            }}
          ></div>
        </div>
      </div>

      <div
        className={classNames(
          ' scrollbar scrollbar-hide-x overflow-x-auto',
          'gantt-scroll',
          'gantt-table',
        )}
        ref={tableBoxRef}
      >
        <div
          className={classNames('gantt-table-body', 'relative  z-0')}
          style={{
            width: `max(${scrollWidth}px, 100%)`,
            height: `max(${scrollBodyHeight}px, ${visibleBodyHeight}px)`,
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
    </>
  );
};
