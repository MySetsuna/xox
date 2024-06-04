import {
  BufferMonths,
  GanttCustomMode,
  GanttMode,
  GanttNode,
  GroupOption,
  TablePining,
  VirtualGanttProps,
} from '@/types';
import {
  getDayDiff,
  getDateFormX,
  getEdges,
  getNodes,
  getRangeAtByCurrentAt,
  buildGanttHeader,
  getIsModeLastDay,
  WEEKDAY_MAP,
} from '@/uitls/gantt';
import {
  ColumnDef,
  ExpandedState,
  useReactTable,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  Row,
  flexRender,
} from '@tanstack/react-table';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import dayjs, { Dayjs } from 'dayjs';
import { groupBy, throttle, isEqual } from 'lodash';
import React from 'react';
import {
  Key,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { NodeTypes, useEdgesState, useNodesState, useReactFlow } from 'reactflow';
import ScrollMirror from 'scrollmirror';

export const Gantt = (props: VirtualGanttProps) => {
  const {
    mode = GanttMode.MonthDay,
    overscan = 10,
    bufferDay = 10,
    groupGap = 10,
    lastGroupGap = 0,
    hasLastGroupGap = false,
    rowHeight = 34,
    cellWidth = 50,
    minBarRange = 1,
    alertHeight = 16,
    milestones = [],
    defaultMilestonesColor = 'blue',
    data,
    currentAt,
    startAt,
    endAt,
    headRender,
    headerHeight: headerHeightOps,
    showYearRow,
    style,
    isHoliday,
    bufferMonths: bufferM,
    isInfiniteX,
    isWeekStartMonday,
    groupOptions,
    isGroupView,
    getBarStart,
    getBarEnd,
    // getToLinkIds,
    getFromLinkIds,
    getRowId,
    GanttBar,
    customHeaderBuilder,
    scrollSyncClassName,
    scrollSyncElementQuery,
    scrollSyncElement,
    onBarChange,
    onDisConnect,
    onConnect,
    getLeafRowOriginalId,
    ganttExpanded,
    renderEdgeDeleteTitle,
    getCustomModeLastDay,
    showAlert,
    alertOptions,
    alertType,
    defaultAlertStyle,
    defaultAlertClassName,
    onDayCell,
    onGroupGap,
    onGroupHeader,
    onHeaderCell,
    isGroup,
    hasFirstGroupGap,
    onRowFloat,
  } = props;
  type TData = (typeof data)[0];

  const [columns, setColumns] = useState<ColumnDef<TData>[]>([]);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    [] as GanttNode<TData>[],
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [startDate, setStartDate] = useState<Dayjs | undefined>(
    startAt?.clone(),
  );
  const [originStart, setOriginStart] = useState<Dayjs | undefined>(
    startAt?.clone(),
  );
  const [bufferMonths, setBufferMonths] = useState<BufferMonths>(
    bufferM ?? [3, 2],
  );

  const [columnPinning, setColumnPinning] = useState<TablePining>({});

  const [expanded, setExpanded] = useState<ExpandedState>({});

  const [endDate, setEndDate] = useState<Dayjs | undefined>(endAt?.clone());
  const [currentDate, setCurrentDate] = useState<Dayjs | undefined>(currentAt);
  const scrollToTimer = useRef<NodeJS.Timeout | null>(null);
  const scrollCallback = useRef<(() => void) | null>(() => {});
  // const [viewportX, setViewportX] = useState<number>(0);

  const parentRef = React.useRef<HTMLDivElement>(null);

  const flowBoxRef = React.useRef<HTMLDivElement>(null);

  const scrollMirrorRef = useRef<ScrollMirror | null>(null);

  const [scrollLeft, setScrollLeft] = useState<number | undefined>(
    parentRef.current?.scrollLeft,
  );

  // const scrollTimerRef = useRef<number | null>(null);

  const {
    groupColumns,
    grouping,
  }: { groupColumns: ColumnDef<TData>[]; grouping: string[] } = useMemo(() => {
    return {
      groupColumns: (groupOptions?.map(({ groupId, groupKey }) => {
        return {
          id: groupId,
          accessorFn: groupKey,
          size: 0,
        };
      }) ?? []) as ColumnDef<TData>[],
      grouping: groupOptions?.map(({ groupId }) => groupId) ?? [],
    };
  }, [groupOptions]);

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
      columnPinning,
    },
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    onColumnPinningChange: setColumnPinning,
    getExpandedRowModel: getExpandedRowModel(),
    // debugTable: true,
  });

  const { rows, rowsById } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => flowBoxRef.current,
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

  const alertMap = useMemo(() => {
    if (startDate && endDate && showAlert) {
      return alertOptions.getAlertMap(
        startDate,
        endDate,
        rows,
        alertOptions.params,
        alertType,
      );
    }
    return {};
  }, [startDate, endDate, alertOptions, rows, showAlert, alertType]);

  const { groupVirtualRows = [] } = useMemo(() => {
    return groupBy(rowVirtualizer.getVirtualItems(), (virtualItem) => {
      const row = rows[virtualItem.index];
      return row.getIsGrouped() ? 'groupVirtualRows' : 'leafVirtualRows';
    });
    // return rowVirtualizer.getVirtualItems().filter((virtualItem) => {
    //   const row = rows[virtualItem.index];
    //   return row.getIsGrouped();
    // });
  }, [rows, rowVirtualizer.getVirtualItems()]);

  const viewportX = useMemo(() => {
    return (originStart?.diff(startDate, 'day') ?? 0) * cellWidth;
  }, [originStart, startDate, cellWidth]);

  const nodeTypes = useMemo(() => {
    return (groupOptions ?? []).reduce<NodeTypes>(
      (pre, { groupId, groupGanttComponent: Component }) => {
        return {
          ...pre,
          [groupId]: (props) => (
            <Component
              {...props}
              setNodes={setNodes}
              onNodesChange={onNodesChange}
              onBarChange={onBarChange}
              originStart={originStart}
              rowsById={rowsById}
              setEdges={setEdges}
            />
          ),
        };
      },
      {
        gantbar: (props) => (
          <GanttBarBox
            {...props}
            setNodes={setNodes}
            onNodesChange={onNodesChange}
            onBarChange={onBarChange}
            originStart={originStart}
            getBarStart={getBarStart}
            getBarEnd={getBarEnd}
            rows={rows}
            groupOptions={groupOptions}
            rowsById={rowsById}
            setEdges={setEdges}
          >
            {GanttBar}
          </GanttBarBox>
        ),
      },
    );
  }, [
    groupOptions,
    GanttBar,
    originStart,
    onBarChange,
    onNodesChange,
    getBarStart,
    getBarEnd,
  ]);

  const resizeLeafNode = useCallback(
    (rowId: string, width: number, date: Dayjs, virtualRow: VirtualItem) => {
      const height = virtualRow.size;
      const y = virtualRow.start;
      const diff = getDayDiff(date, originStart, 0);
      const row = rowsById[rowId];

      if (!row) {
        throw new Error(`can't find row by id:${rowId}`);
      }
      const id = `${getLeafRowOriginalId(row)}`;
      let startAt: Dayjs | undefined;
      let endAt: Dayjs | undefined;
      if (originStart) {
        const offsetLeft = diff * cellWidth;
        const offsetRight = offsetLeft + (width ? width - cellWidth : 0);
        startAt = getDateFormX(offsetLeft, cellWidth, originStart);
        endAt = getDateFormX(offsetRight, cellWidth, originStart);
      }

      const newNode: GanttNode<TData> = {
        hidden: false,
        id,
        // height,
        // width,
        data: {
          row,
          fixedY: y,
          height,
          width,
          minWidth: minBarRange * cellWidth,
          index: virtualRow.index,
          cellWidth,
          hidden: false,
          emptyRange: false,
          startAt,
          endAt: endAt?.isBefore(startAt, 'date') ? startAt : endAt,
          creating: true,
        },
        position: {
          x: diff * cellWidth,
          y,
        },
        width,
        height,
        style: {
          height,
          width,
          cursor: 'grab',
          visibility: 'visible',
        },
        type: 'gantbar',
      };
      setNodes((nds) =>
        nds.filter((node) => node.id !== newNode.id).concat([newNode]),
      );
    },
    [
      originStart,
      getBarStart,
      getBarEnd,
      cellWidth,
      minBarRange,
      getRowId,
      getLeafRowOriginalId,
      rows,
    ],
  );

  const throttleSetEdges = useCallback(
    throttle(
      (
        rows: Row<TData>[],
        virtualItems: VirtualItem[],
        getFromLinkIds: (row: TData) => Key[],
        getLeafRowOriginalId: (row: Row<TData>) => string,
      ) => {
        const edges = getEdges(
          rows,
          virtualItems,
          getFromLinkIds,
          getLeafRowOriginalId,
        );

        if (edges) {
          setEdges(edges);
        }
      },
      300,
    ),
    [],
  );

  const throttleSetNodes = useCallback(
    throttle(
      (
        rows: Row<TData>[],
        virtualItems: VirtualItem[],
        getDayDiff: (
          date?: Dayjs,
          offsetDate?: Dayjs,
          defaultDiff?: number,
        ) => number,
        originStart: Dayjs,
        getBarStart: (row: TData) => Dayjs | undefined,
        getBarEnd: (row: TData) => Dayjs | undefined,
        cellWidth: number,
        minBarRange: number,
        getRowId: (row: Row<TData>) => string,
        getLeafRowOriginalId: (row: Row<TData>) => string,
        groupGap: number,
        isGroupView: boolean,
        groupOptions?: GroupOption<TData>[],
        isGroup?: (row: Row<TData>) => boolean,
        hasFirstGroupGap?: boolean,
      ) => {
        const nodes = getNodes(
          rows,
          virtualItems,
          getDayDiff,
          originStart,
          getBarStart,
          getBarEnd,
          cellWidth,
          minBarRange,
          getRowId,
          getLeafRowOriginalId,
          groupGap,
          !!isGroupView,
          groupOptions,
          isGroup,
          hasFirstGroupGap,
        );
        if (nodes) {
          setNodes(nodes);
        }
      },
      300,
    ),
    [],
  );

  useEffect(() => {
    if (startAt && endAt) {
      setStartDate(startAt);
      setOriginStart(startAt);
      setEndDate(endAt);
    }
  }, [startAt, endAt]);

  useEffect(() => {
    if (bufferM && !isEqual(bufferM, bufferMonths)) {
      setBufferMonths(bufferM);
    }
  }, [bufferM, bufferMonths]);

  useEffect(() => {
    if (!scrollMirrorRef.current) {
      const mirrorElements =
        scrollSyncElement ??
        document.querySelectorAll(
          scrollSyncElementQuery ?? `.${scrollSyncClassName}`,
        );
      if (mirrorElements.length >= 2) {
        scrollMirrorRef.current = new ScrollMirror(mirrorElements, {
          horizontal: false,
          proportional: true,
        });
      }
    }
  }, []);

  useEffect(() => {
    setCurrentDate(currentAt?.isValid() ? currentAt : dayjs());
  }, [currentAt]);

  const { setViewport, getNode } = useReactFlow();

  useEffect(() => {
    setViewport({
      x: viewportX,
      y: 0,
      zoom: 1,
    });
  }, [viewportX]);

  useEffect(() => {
    if (currentDate && bufferMonths) {
      const { startAt, endAt } = getRangeAtByCurrentAt(
        currentDate,
        bufferMonths,
      );

      setStartDate(startAt);
      setOriginStart(startAt);
      setEndDate(endAt);
      if (parentRef.current && isInfiniteX) {
        const startOffset = currentDate.diff(startAt, 'day');
        scrollCallback.current = () =>
          parentRef.current?.scrollTo({
            left: (startOffset > 3 ? startOffset - 3 : startOffset) * cellWidth,
          });
        const onScroll = () => {
          if (scrollToTimer.current) clearTimeout(scrollToTimer.current);
          scrollToTimer.current = setTimeout(() => {
            scrollCallback.current?.();
            scrollCallback.current = null;
          }, 10);
        };
        const observer = new ResizeObserver(onScroll);
        observer.observe(parentRef.current);
        return () => {
          observer.disconnect();
          if (scrollToTimer.current) clearTimeout(scrollToTimer.current);
        };
      }
    }
  }, [currentDate, bufferMonths, cellWidth]);

  useEffect(() => {
    setColumnPinning({ right: grouping });
  }, [grouping]);

  useEffect(() => {
    if (ganttExpanded) {
      setExpanded(ganttExpanded);
    }
  }, [ganttExpanded]);

  useEffect(() => {
    requestIdleCallback(
      () => {
        throttleSetEdges(
          rows,
          rowVirtualizer.getVirtualItems(),
          getFromLinkIds,
          getLeafRowOriginalId,
        );
      },
      { timeout: 100 },
    );
  }, [
    rows,
    rowVirtualizer.getVirtualItems(),
    getFromLinkIds,
    getLeafRowOriginalId,
  ]);

  useEffect(() => {
    if (originStart) {
      requestIdleCallback(
        () => {
          throttleSetNodes(
            rows,
            rowVirtualizer.getVirtualItems(),
            getDayDiff,
            originStart,
            getBarStart,
            getBarEnd,
            cellWidth,
            minBarRange,
            getRowId,
            getLeafRowOriginalId,
            groupGap,
            !!isGroupView,
            groupOptions,
            isGroup,
          );
        },
        { timeout: 100 },
      );
    }
  }, [
    originStart,
    rows,
    isGroupView,
    groupGap,
    getDayDiff,
    getBarStart,
    minBarRange,
    rowVirtualizer.getVirtualItems(),
    groupOptions,
    getLeafRowOriginalId,
    getRowId,
    isGroup,
    hasFirstGroupGap,
  ]);

  useLayoutEffect(() => {
    if (startDate && endDate) {
      let columns: ColumnDef<TData>[] = [];
      if (GanttCustomMode.CustomMode === mode && customHeaderBuilder) {
        columns = customHeaderBuilder<TData, GanttCustomMode>(
          mode,
          startDate,
          endDate,
          headRender,
          cellWidth,
          isWeekStartMonday,
        );
      } else if (Object.values(GanttMode).some((item) => item === mode)) {
        columns = buildGanttHeader<TData>(
          mode as GanttMode,
          startDate,
          endDate,
          headRender,
          cellWidth,
          isWeekStartMonday,
        );
      }
      setColumns([...columns, ...groupColumns]);
      scrollCallback.current?.();
      table.setGrouping(grouping);
    }
  }, [
    startDate,
    endDate,
    headRender,
    cellWidth,
    isWeekStartMonday,
    mode,
    groupColumns,
    bufferDay,
    grouping,
  ]);

  const handleScroll = useCallback(() => {
    // document.body.style.pointerEvents = 'none';
    // if (scrollTimerRef.current) {
    //   cancelIdleCallback(scrollTimerRef.current);
    //   scrollTimerRef.current = null;
    // }
    // scrollTimerRef.current = requestIdleCallback(
    //   () => {
    //     document.body.style.pointerEvents = 'auto';
    //   },
    //   { timeout: 50 }
    // );
    setScrollLeft(parentRef.current?.scrollLeft);
    if (!scrollCallback.current && isInfiniteX && parentRef.current) {
      const toLeft = parentRef.current?.scrollLeft === 0;
      const toRight =
        Math.floor(
          parentRef.current?.scrollLeft + parentRef.current?.clientWidth,
        ) === parentRef.current?.scrollWidth;

      if (toLeft) {
        scrollCallback.current = () => {
          parentRef.current?.scrollTo({
            left: cellWidth * bufferDay,
          });
          scrollCallback.current = null;
        };
        setEndDate((date) => date?.add(-bufferDay, 'day'));
        setStartDate((date) => date?.add(-bufferDay, 'day'));
        return;
      }
      if (toRight) {
        scrollCallback.current = () => {
          parentRef.current?.scrollTo({
            left: parentRef.current.scrollLeft - cellWidth * bufferDay,
          });
          scrollCallback.current = null;
        };
        setStartDate((date) => {
          return date?.add(bufferDay, 'day');
        });
        setEndDate((date) => date?.add(bufferDay, 'day'));
        return;
      }
    }
  }, [cellWidth, bufferDay]);

  const visibleHeaderGroups = useMemo(
    () => table.getCenterHeaderGroups().slice(showYearRow ? 0 : 1),
    [showYearRow, table, table.getCenterHeaderGroups()],
  );

  const leafHeaderGroupHeaders =
    visibleHeaderGroups[visibleHeaderGroups.length - 1]?.headers;

  const headerHeight = useMemo(
    () =>
      visibleHeaderGroups.reduce((totalHeight, _headerGroup, index) => {
        const height =
          headerHeightOps?.[index] || headerHeightOps?.[0] || rowHeight;
        return totalHeight + height;
      }, 0) + (showAlert ? alertHeight : 0),
    [headerHeightOps, showAlert, alertHeight, rowHeight, visibleHeaderGroups],
  );

  const bodyVisibleHeight =
    (parentRef.current?.clientHeight ?? 0) - headerHeight;

  const ganttBodyHeight = rowVirtualizer.getTotalSize();

  const scrollHeight =
    ganttBodyHeight +
    headerHeight +
    (hasLastGroupGap ? lastGroupGap ?? groupGap : 0);

  const scrollWidth = table.getCenterTotalSize();

  const getDateMilestone = useCallback(
    (date: Dayjs) => {
      return milestones.find((ms) => ms.date.isSame(date, 'date'));
    },
    [milestones],
  );

  const isAlertType = useCallback(
    (type: string) => {
      return typeof alertType === 'string' && alertType === type;
    },
    [alertType],
  );

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
      }}
    >
      <div
        ref={parentRef}
        className={['gantt-container', 'container', scrollSyncClassName].join(
          ' ',
        )}
        style={style}
        onScroll={handleScroll}
      >
        {!!onRowFloat &&
          rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const row = rows[virtualItem.index];
            const isGroupRow = row.getIsGrouped();
            const isGroupHeader = isGroup?.(row);
            const node = isGroup
              ? getNode(`${row.groupingColumnId}:${getRowId(row)}`)
              : getNode(getLeafRowOriginalId(row));

            return (
              <div
                key={virtualItem.key}
                className="group-float-row"
                style={{
                  height: rowHeight,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                  zIndex: 3,
                }}
                {...onRowFloat(
                  {
                    height: rowHeight,
                    width: scrollWidth,
                    transform: `translateY(${
                      virtualItem.start + headerHeight
                    }px) translateX(0)`,
                    zIndex: 3,
                    position: 'absolute',
                    pointerEvents: 'none',
                  },
                  rows[virtualItem.index],
                  virtualItem,
                  node,
                  isGroupRow,
                  isGroupHeader,
                  startDate,
                  scrollLeft,
                  parentRef.current?.clientWidth,
                )}
              ></div>
            );
          })}
        <div
          className="gantt-scroll-container"
          style={{
            height: scrollHeight,
            width: scrollWidth,
          }}
        >
          <div
            className="gantt-header"
            style={{
              display: 'flex',
              position: 'sticky',
              top: 0,
              zIndex: 4,
              flexDirection: 'column',
              // overflow: 'hidden',
            }}
          >
            {visibleHeaderGroups.map((headerGroup, index) => {
              const height =
                headerHeightOps?.[index] || headerHeightOps?.[0] || rowHeight;
              return (
                <div
                  key={headerGroup.id}
                  // style={{ display: 'flex', overflow: 'hidden' }}
                  style={{ display: 'flex' }}
                >
                  {headerGroup.headers
                    .filter((header) => !grouping.includes(header.column.id))
                    .map((header, index) => {
                      const isLeafHeader = header.depth === 3;

                      const onHeader = onHeaderCell?.(header, isLeafHeader);

                      return (
                        <div
                          key={header.id}
                          // colSpan={header.colSpan}
                          style={{
                            // background: 'black',
                            // color: 'white',
                            fontWeight: 'bolder',
                            width: header.getSize(),
                            height,
                            flexShrink: 0,
                            // borderRight: '1px white solid',
                            // borderBottom: !isLeafHeader
                            //   ? '1px white solid'
                            //   : 'unset',
                            zIndex: index,
                          }}
                          {...onHeader}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              style={
                                !isLeafHeader
                                  ? {
                                      position: 'sticky',
                                      left: 0,
                                      width: 0,
                                      whiteSpace: 'nowrap',
                                      height,
                                      overflow: 'visible',
                                    }
                                  : { height }
                              }
                            >
                              <div
                                style={{
                                  position: 'absolute',
                                  overflow: 'hidden',
                                  padding: '0 5px',
                                  width: header.getSize(),
                                }}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              );
            })}
            {showAlert && (
              <div
                className="gantt-alert"
                style={{ height: alertHeight, display: 'flex', zIndex: 999 }}
              >
                {leafHeaderGroupHeaders?.map((header) => {
                  const date = dayjs(header.id);

                  const isModeLastDay =
                    mode === GanttCustomMode.CustomMode
                      ? getCustomModeLastDay?.(date, isWeekStartMonday) ?? false
                      : getIsModeLastDay(mode, date, isWeekStartMonday);
                  const dayLineTop =
                    headerHeightOps?.[headerHeightOps.length - 1] ||
                    headerHeightOps?.[0] ||
                    rowHeight;

                  const dayLineHeight = dayLineTop + alertHeight;

                  const type = alertOptions?.getAlertType(date, rows, alertMap);

                  const isShowAlertType = isAlertType(type);

                  const {
                    modeLastDayBorder,
                    component: AlertComponent,
                    elementProps,
                    typeElemetPropsMap,
                    params,
                  } = alertOptions;
                  const typeElemetProps = typeElemetPropsMap[type];

                  const ms = getDateMilestone(date);
                  return (
                    <React.Fragment key={header.id}>
                      {ms && (
                        <GanttMilestoneLine
                          width={2}
                          height={dayLineHeight}
                          top={-dayLineTop}
                          hasTopPot
                          style={{ zIndex: 89 }}
                          left={header.getStart()}
                          cellWidth={header.getSize()}
                          isModeLastDay={isModeLastDay}
                          color={defaultMilestonesColor}
                          {...ms}
                        />
                      )}
                      <div
                        className={defaultAlertClassName}
                        {...elementProps}
                        {...typeElemetProps}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          width: header.getSize(),
                          height: '100%',
                          // backgroundColor: 'red',
                          // pointerEvents: 'none',
                          // backgroundColor: 'red',
                          // zIndex: isCurrentDate ?  : -1,
                          zIndex: 88,
                          position: 'relative',
                          ...defaultAlertStyle,

                          borderRight: isModeLastDay
                            ? modeLastDayBorder ?? '1px solid black'
                            : 'unset',
                          ...elementProps?.style,
                          ...(isShowAlertType ? typeElemetProps?.style : {}),
                        }}
                      >
                        {AlertComponent && (
                          <AlertComponent
                            type={type}
                            date={date}
                            rows={rows}
                            alertMap={alertMap}
                            params={params}
                            start={startDate}
                            end={endDate}
                            isShowAlertType={isShowAlertType}
                          />
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>

          <div
            className="gantt-flow"
            ref={flowBoxRef}
            style={{
              position: 'absolute',
              display: 'flex',
              top: headerHeight,
              width: scrollWidth,
              height: Math.max(ganttBodyHeight, bodyVisibleHeight),
              zIndex: 2,
              backgroundColor: 'white',
              // pointerEvents: 'none',
            }}
          >
            <GanttFlow
              renderEdgeDeleteTitle={renderEdgeDeleteTitle}
              nodes={nodes}
              setNodes={setNodes}
              cellWidth={cellWidth}
              nodeTypes={nodeTypes}
              originStartDate={originStart}
              onBarChange={onBarChange}
              edges={edges}
              setEdges={setEdges}
              onEdgesChange={onEdgesChange}
              onDisConnect={onDisConnect}
              onConnect={onConnect}
            >
              <div
                className="gantt-background"
                style={{
                  position: 'absolute',
                  display: 'flex',
                  // top: headerHeight,
                  width: scrollWidth,
                  height: Math.max(ganttBodyHeight, bodyVisibleHeight),
                  // height: 0,
                  zIndex: 2,
                  backgroundColor: 'white',
                  // pointerEvents: 'none',
                }}
              >
                {(onGroupGap || onGroupHeader) &&
                  groupVirtualRows.map((virtualItem) => {
                    const row = rows[virtualItem.index];
                    const isGrouped = isGroup?.(row);
                    return (
                      <React.Fragment key={virtualItem.key}>
                        {(hasFirstGroupGap || !!virtualItem.index) &&
                          isGrouped &&
                          onGroupGap && (
                            <div
                              className="group-gap"
                              style={{
                                height: groupGap,
                                width: '100%',
                              }}
                              {...onGroupGap(
                                {
                                  height: groupGap,
                                  width: scrollWidth,
                                  position: 'absolute',
                                  zIndex: 88,
                                  transform: `translateY(${virtualItem.start}px)`,
                                },
                                rows[virtualItem.index],
                                virtualItem,
                              )}
                            ></div>
                          )}
                        {onGroupHeader && (
                          <div
                            className="group-header"
                            style={{
                              height: rowHeight,
                              width: '100%',
                              transform: `translateY(${
                                isGrouped &&
                                (hasFirstGroupGap || !!virtualItem.index)
                                  ? groupGap
                                  : 0
                              }px)`,
                            }}
                            {...onGroupHeader(
                              {
                                height: rowHeight,
                                width: scrollWidth,
                                transform: `translateY(${
                                  virtualItem.start +
                                  (isGrouped &&
                                  (hasFirstGroupGap || !!virtualItem.index)
                                    ? groupGap
                                    : 0)
                                }px)`,
                                zIndex: 88,
                                position: 'absolute',
                              },
                              rows[virtualItem.index],
                              virtualItem,
                            )}
                          ></div>
                        )}
                      </React.Fragment>
                    );
                  })}
                {leafHeaderGroupHeaders?.map((header) => {
                  const date = dayjs(header.id);
                  const dayNumber = date.get('day');
                  const isWeekend = dayNumber === 0 || dayNumber === 6;
                  const isRest = isHoliday ? isHoliday?.(date) : isWeekend;
                  const dayLineHeight = Math.max(
                    ganttBodyHeight,
                    bodyVisibleHeight,
                  );
                  const dateCellProps = onDayCell?.(
                    date,
                    rows,
                    rowVirtualizer,
                    resizeLeafNode,
                    getNode,
                  );

                  const ms = getDateMilestone(date);

                  return (
                    <React.Fragment key={header.id}>
                      {ms && (
                        <GanttMilestoneLine
                          width={2}
                          height={dayLineHeight}
                          top={0}
                          isBody
                          left={header.getStart()}
                          cellWidth={cellWidth}
                          style={{
                            zIndex: 89,
                          }}
                          color={defaultMilestonesColor}
                          {...ms}
                        />
                      )}
                      <div
                        key={header.id}
                        {...dateCellProps}
                        style={{
                          display: 'flex',
                          // justifyContent: 'center',
                          width: header.getSize(),
                          height: '100%',
                          // backgroundColor: 'red',
                          borderRight: '1px solid #CDD6E4',
                          // pointerEvents: 'none',
                          backgroundColor: isRest ? '#CDD6E460' : 'white',
                          // zIndex: isCurrentDate ?  : -1,
                          // zIndex: arr.length - index,
                          zIndex: -1,
                          position: 'relative',
                          ...dateCellProps?.style,
                        }}
                      ></div>
                    </React.Fragment>
                  );
                })}
              </div>
            </GanttFlow>
          </div>
        </div>
      </div>
    </div>
  );
};

const defaultProps: Partial<VirtualGanttProps> = {
  mode: GanttMode.MonthDay,
  bufferMonths: [2, 2],
  showYearRow: false,
  rowHeight: 34,
  overscan: 10,
  bufferDay: 20,
  cellWidth: 60,
  isInfiniteX: true,
  isWeekStartMonday: true,
  minBarRange: 1,
  headerHeight: [30],
  showAlert: true,
  headRender: {
    date: (date) => {
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
    month: (date) => {
      return () => {
        const month = date.get('month');
        if (!month) {
          return date.format('YYYY年M月');
        }
        return date.format('M月');
      };
    },
    week: (date) => {
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
  },
};

Gantt.defaultProps = defaultProps;

export const VirtualGantt = memo(Gantt);
