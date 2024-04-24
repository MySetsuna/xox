import { memo, useContext } from 'react';
import { GridChildComponentProps, areEqual } from 'react-window';
import { EditContext } from '../VirtaulGrid/VirtaulGrid';

import { Select } from '@radix-ui/themes';

export const VirtaulCell = memo(
  (props: GridChildComponentProps<{ item: any; toggleItemEditing: any }>) => {
    const { data, columnIndex, rowIndex, style } = props;
    const { item, toggleItemEditing } = data;
    const [value] = useContext(EditContext);

    return (
      <div
        style={style}
        onClick={() =>
          toggleItemEditing(rowIndex, columnIndex, style)
        }
      >
        {value?.rowIndex === rowIndex && value?.columnIndex === columnIndex
          ? undefined
          : item[rowIndex][rowIndex + '_' + (columnIndex + 1)]}
      </div>
    );
  },
  areEqual,
);
