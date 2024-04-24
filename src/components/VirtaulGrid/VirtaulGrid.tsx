import { FixedSizeGrid as Grid } from 'react-window';
import { VirtaulCell } from '../VirtulCell/VirtulCell';
import memoizeOne from 'memoize-one';
import {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const createItemData = memoizeOne((item, toggleItemEditing) => ({
  item,
  toggleItemEditing,
}));

export const EditContext = createContext(undefined);

export const VirtaulGrid = ({ rowData }: any) => {
  const [rowIndex, setRowIndex] = useState();
  const [columnIndex, setColumnIndex] = useState();
  const [style, setStyle] = useState();
  const toggleItemEditing = useCallback((rowIndex, columnIndex, style) => {
    setRowIndex(rowIndex);
    setColumnIndex(columnIndex);
    setStyle(style);
  }, []);

  const toggleItemEditEnd = useCallback(() => {
    setRowIndex(undefined);
    setColumnIndex(undefined);
    setStyle(undefined);
  }, []);

  const itemData = createItemData(rowData, toggleItemEditing);

  return (
    <Grid
      columnCount={4}
      columnWidth={80}
      height={800}
      useIsScrolling
      itemData={itemData}
      rowCount={100}
      rowHeight={35}
      width={800}
      overscanColumnCount={5}
      overscanRowCount={5}
    >
      {VirtaulCell}
    </Grid>
  );
};
