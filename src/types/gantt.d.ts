export type GanttProps = {
  showYearHeader: boolean;
  showAlert: boolean;
  alertHeight: number;
};

export type BaseGroupHeaderData<G = unknown> = {
  id: Key;
  data: G;
  startAt?: Dayjs;
  endAt?: Dayjs;
  finishedCount: number;
  unfinishedCount: number;
  count: number;
};

export interface GanttBarData<T = unknown> {
  row: Row<T>;
  fixedY: number;
  fixedX?: number;
  height: number;
  width: number;
  minWidth: number;
  cellWidth: number;
  index: number;
  hidden: boolean;
  emptyRange: boolean;
  startAt?: Dayjs;
  endAt?: Dayjs;
  creating?: boolean;
}

export interface GroupGanttBarData<T, D> extends GanttBarData<T> {
  group: D;
}

export type GanttNode<T, D = unknown> = Node<
  GanttBarData<T> | GroupGanttBarData<T, D>
>;

export type CmpWithChildrenFn<T> = T & {
  children?:
    | ((props: T) => JSX.Element)
    | MemoExoticComponent<(props: T) => JSX.Element>;
};

export type GanttBarBoxProps<T = unknown> = CmpWithChildrenFn<GanttBarProps<T>>;

export type GanttBarProps<T> = NodeProps<GanttBarData<T>> & {
  setNodes: React.Dispatch<React.SetStateAction<GanttNode<T>[]>>;
  onNodesChange?: (changes: unknown) => void;
  onBarChange?: (startAt: Dayjs, endAt: Dayjs, node: GanttNode<T>) => void;
  originStart?: Dayjs;
  onLeftConnect?: (from: GanttNode<T>, to: GanttNode<T>) => void;
  onRightConnect?: (from: GanttNode<T>, to: GanttNode<T>) => void;
  getBarStart: (row: T) => Dayjs | undefined;
  getBarEnd: (row: T) => Dayjs | undefined;
  rows: Row<T>[];
  groupOptions: GroupOption<unknown>[] | undefined;
  rowsById: Record<string, Row<T>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<T>[]>>;
};

export type GroupGanttBarProps<T, D> = NodeProps<GroupGanttBarData<T, D>> & {
  setNodes: React.Dispatch<React.SetStateAction<GanttNode<T, D>[]>>;
  onNodesChange: (changes: unknown) => void;
  onBarChange?: (startAt: unknown, endAt: unknown, node: GanttNode<T>) => void;
  originStart?: Dayjs;
  rowsById: Record<string, Row<T>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<T>[]>>;
};

export type GroupOption<T, D = BaseGroupHeaderData> = {
  groupHeaderBuilder?: (row: Row<T>) => BaseGroupHeaderData;
  groupKey: ((data: T) => Key) | keyof T;
  groupId: string;
  isFixedX?: boolean;
  groupGanttComponent: FC<GroupGanttBarProps<T, D>>;
};

export type HeadRender<T> = {
  date?: (date: Dayjs) => ColumnDefTemplate<HeaderContext<T, unknown>>;
  week?: (
    date: Dayjs,
    timezone: string,
  ) => ColumnDefTemplate<HeaderContext<T, unknown>>;
  month?: (date: Dayjs) => ColumnDefTemplate<HeaderContext<T, unknown>>;
};

export type BufferMonths = [number] | [number, number];

export type HeaderHeightOps =
  | [number]
  | [number, number]
  | [number, number, number];

export enum BaseGanttAlertType {
  idle = 'idle',
  conflict = 'conflict',
}

export type GanttAlertProps<T = unknown, AM = unknown, P = unknown> = {
  type: string;
  date: Dayjs;
  start?: Dayjs;
  end?: Dayjs;
  rows: Row<T>[];
  alertMap: AM;
  params: P;
  isShowAlertType: boolean;
};

export interface GanttAlertOptions<
  T = unknown,
  AM = unknown,
  TY = unknown,
  P = unknown,
> {
  component?: (props: GanttAlertProps<T, AM>) => JSX.Element;
  elementProps?: HTMLAttributes<HTMLDivElement>;
  modeLastDayBorder?: CSSProperties['border'];
  getAlertMap: (
    start: Dayjs,
    end: Dayjs,
    rows: Row<T>[],
    params: P,
    showType?: TY,
  ) => AM;
  getAlertType: (date: Dayjs, rows: Row<T>[], data: AM) => TY;
  params?: P;
  typeElemetPropsMap: {
    [type: string]: HTMLAttributes<HTMLDivElement>;
  };
}

export type GanttOnDayCell<T = unknown> = (
  date: Dayjs,
  rows: Row<T>[],
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>,
  resizeLeafNode: (
    rowId: string,
    width: number,
    date: Dayjs,
    virtualRow: VirtualItem,
  ) => void,
  getNode: (id: string) => GanttNode<T> | undefined,
) => Omit<HTMLAttributes<HTMLDivElement>, 'onMouseMove'> & {
  onMouseMove:
    | DebouncedFunc<(event: React.MouseEvent<HTMLDivElement>) => void>
    | HTMLAttributes<HTMLDivElement>['onMouseMove'];
};

export type GanttOnRow<T = unknown> = (
  style: CSSProperties,
  row: Row<T>,
  virtualRow: VirtualItem,
  node?: GanttNode<T>,
  isGroupRow?: boolean,
  isGroupHeader?: boolean,
  currentAt?: Dayjs,
  scrollLeft?: number,
  clientWidth?: number,
) => HTMLAttributes<HTMLDivElement>;

export type GanttOnHeaderCell<T = unknown> = (
  header?: Header<T, unknown>,
  isLeafHeader?: boolean,
) => HTMLAttributes<HTMLDivElement>;

type TablePining = {
  left?: string[];
  right?: string[];
};

export type VirtualGanttProps<T extends object = unknown> = {
  data: T[];
  style?: CSSProperties;
  rowHeight?: number;
  cellWidth?: number;
  overscan?: number;
  bufferDay?: number;
  headRender?: HeadRender<T>;
  isHoliday?: (date: Dayjs) => boolean;
  isInfiniteX?: boolean;
  isWeekStartMonday?: boolean;
  getBarStart: (row: T) => Dayjs | undefined;
  getBarEnd: (row: T) => Dayjs | undefined;
  getToLinkIds: (row: T) => Key[];
  getFromLinkIds: (row: T) => Key[];
  getRowId: (row: Row<T>) => string;
  getLeafRowOriginalId: (row: Row<T>) => string;
  minBarRange?: number;
  // barStyle?: CSSProperties | ((row: T, index: number) => CSSProperties);
  // barClassName?: string | ((row: T, index: number) => string);
  isGroupView?: boolean;
  groupOptions?: Array<GroupOption<T>>;
  GanttBar?:
    | ((props: GanttBarProps<T>) => JSX.Element)
    | MemoExoticComponent<(props: GanttBarProps<T>) => JSX.Element>;
  groupGap?: number;
  ganttExpanded?: { [expandKey: string]: true };
  showYearRow?: boolean;
  headerHeight?: HeaderHeightOps;
  alertHeight?: number;
  scrollSyncElement?: Element[] | NodeListOf<Element>;
  scrollSyncElementQuery?: string;
  scrollSyncClassName: string;
  onBarChange?: (startAt: Dayjs, endAt: Dayjs, node: GanttNode<T>) => void;
  onDisConnect?: (from: string, to: string) => void;
  onConnect?: (connection: Connection) => boolean | Promise<boolean>;
  renderEdgeDeleteTitle?: (props: {
    from: GanttNode<unknown>;
    to: GanttNode<unknown>;
  }) => ReactNode;
  getCustomModeLastDay?: (date: Dayjs, isWeekStartMonday?: boolean) => boolean;
  defaultAlertStyle?: CSSProperties;
  defaultAlertClassName?: string;
  hasLastGroupGap?: boolean;
  hasFirstGroupGap?: boolean;
  lastGroupGap?: number;
  onDayCell?: GanttOnDayCell<T>;
  alertType?: string;
  milestones?: GanttMilestoneType[];
  defaultMilestonesColor?: string;
  onGroupGap?: GanttOnRow<T>;
  onGroupHeader?: GanttOnRow<T>;
  onRowFloat?: GanttOnRow<T>;
  onHeaderCell?: GanttOnHeaderCell<T>;
  isGroup?: (row: Row<T>) => boolean;
} & (
  | {
      startAt: Dayjs;
      endAt: Dayjs;
      currentAt?: undefined;
      bufferMonths?: undefined;
    }
  | {
      startAt?: undefined;
      endAt?: undefined;
      currentAt: Dayjs;
      bufferMonths: BufferMonths;
    }
) &
  (
    | {
        mode?: GanttMode;
        customHeaderBuilder?: undefined;
      }
    | {
        mode: GanttCustomMode;
        customHeaderBuilder: GanttHeaderBuilder;
      }
  ) &
  (
    | {
        alertOptions: GanttAlertOptions<T>;
        showAlert: true;
      }
    | {
        alertOptions?: GanttAlertOptions<T>;
        showAlert?: false;
      }
  );
