import {
  Avatar,
  Box,
  Button,
  ContextMenu,
  Flex,
  Heading,
  HoverCard,
  Link,
  Skeleton,
  Slot,
  Text,
  Theme,
  ThemePanel,
  VisuallyHidden,
} from '@radix-ui/themes';
import classNames from 'classnames';
import { useForm, SubmitHandler } from 'react-hook-form';
import { invoke } from '@tauri-apps/api';
import { isTauri } from '@/uitls';
import { VirtaulGrid } from './components/VirtaulGrid/VirtaulGrid';
type Inputs = {
  example: string;
  exampleRequired: string;
};

export default function App() {
  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   formState: { errors },
  // } = useForm<Inputs>({ mode: 'all' });
  // const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  if (isTauri()) {
    invoke('greet', { name: 'World' })
      // `invoke` 返回异步函数
      .then((response) => console.log(response));
  }
  // console.log(watch('example')); // watch input value by passing the name of it


  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <Theme
      accentColor="crimson"
      grayColor="sand"
      radius="large"
      scaling="95%"
      appearance="light"
    >
      <Box height="100vh" width="100%" p={'5'}>
        <Box height={'100%'} className="bg-yellow-200 rounded">
          <VirtaulGrid
            rowData={Array(100)
              .fill(0)
              .map((item, index) => ({
                [index + '_' + 1]: 1,
                [index + '_' + 2]: 2,
                [index + '_' + 3]: 3,
                [index + '_' + 4]: 4,
              }))}
          />
        </Box>
      </Box>
    </Theme>
  );
}
