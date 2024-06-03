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
import { invoke } from '@tauri-apps/api';
import { isTauri } from '@/uitls';
import { GanttLayout } from './components/GanttLayout/GanttLayout';
import { makeTask } from './examples/makeData';

const mdata = makeTask(50);
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
      className="scrollbar"
    >
      <GanttLayout
        columns={[
          {
            id: 'index',
            accessorFn: (_data, index) => index + 1,
            size: 80,
            cell: (data) => (
              <div className="text-blue-500 h-full">
                {data.getValue<number>()}
              </div>
            ),
          },
          { id: 'artStoryId', accessorKey: 'artStoryId', size: 80 },
          { id: 'startAt', accessorKey: 'startAt', size: 150 },
          { id: 'endAt', accessorKey: 'endAt', size: 150 },
          { id: 'handler', accessorKey: 'handler', size: 100 },
          {
            id: 'priority',
            accessorKey: 'priority',
            size: 100,
            aggregatedCell(props) {
              return props.renderValue();
            },
          },
        ]}
        data={mdata}
        headerHeight={[20]}
        overscan={5}
        rowHeight={30}
        tableColumnPinning={{
          left: ['index', 'artStoryId'],
          right: ['priority'],
        }}
      />
      <VisuallyHidden>44444444444444444444444444</VisuallyHidden>
      <Slot
        onClick={(event) => {
          if (!event.defaultPrevented)
            console.log('Not logged because default is prevented.');
          if (isTauri()) {
            invoke('greet', { name: 'jxk' })
              // `invoke` 返回异步函数
              .then((response) => console.log(response));
          }
        }}
      >
        <button>333333333333333</button>
      </Slot>
      <Text>
        <Skeleton>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          felis tellus, efficitur id convallis a, viverra eget libero. Nam magna
          erat, fringilla sed commodo sed, aliquet nec magna.
        </Skeleton>
      </Text>
      <Text>
        Follow{' '}
        <HoverCard.Root>
          <HoverCard.Trigger>
            <Link href="#" target="_blank">
              @radix_ui
            </Link>
          </HoverCard.Trigger>
          <HoverCard.Content maxWidth="300px">
            <Flex gap="4">
              <Avatar
                size="3"
                fallback="R"
                radius="full"
                src="https://pbs.twimg.com/profile_images/1337055608613253126/r_eiMp2H_400x400.png"
              />
              <Box>
                <Heading size="3" as="h3">
                  Radix
                </Heading>
                <Text as="div" size="2" color="gray" mb="2">
                  @radix_ui
                </Text>
                <Text as="div" size="2">
                  React components, icons, and colors for building high-quality,
                  accessible UI.
                </Text>
              </Box>
            </Flex>
          </HoverCard.Content>
        </HoverCard.Root>{' '}
        for updates.
      </Text>
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <Box height="400px" width="500px" className="bg-yellow-200 rounded">
            444
          </Box>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item shortcut="⌘ E">Edit</ContextMenu.Item>
          <ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item shortcut="⌘ N">Archive</ContextMenu.Item>

          <ContextMenu.Sub>
            <ContextMenu.SubTrigger>More</ContextMenu.SubTrigger>
            <ContextMenu.SubContent>
              <ContextMenu.Item>Move to project…</ContextMenu.Item>
              <ContextMenu.Item>Move to folder…</ContextMenu.Item>
              <ContextMenu.Separator />
              <ContextMenu.Item>Advanced options…</ContextMenu.Item>
            </ContextMenu.SubContent>
          </ContextMenu.Sub>

          <ContextMenu.Separator />
          <ContextMenu.Item>Share</ContextMenu.Item>
          <ContextMenu.Item>Add to favorites</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item shortcut="⌘ ⌫" color="red">
            Delete
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
      <Button className=" bg-red-a2">
        8888<Link>7777777</Link>
      </Button>
      <Button className=" bg-red-a12" highContrast>
        8888<Link>7777777</Link>
      </Button>
      <ThemePanel onSubmit={(data) => console.log(data, '7777777777')} />
      <a
        href="#"
        className="has-[.project-name:hover]:bg-red-600 block max-w-xs mx-auto rounded-lg p-6 bg-white ring-1 ring-slate-900/5 shadow-lg space-y-3 hover:bg-sky-500 hover:ring-sky-500"
      >
        <div
          className="flex items-center space-x-3 project-name"
          onClick={() => {
            Notification.requestPermission().then((promise) => {
              const img = '/to-do-notifications/img/icon-128.png';
              const text = `嘿！您的任务“${promise.toString()}”现已过期。`;
              const notification = new Notification('待办列表', {
                body: text,
                icon: img,
              });
              notification.onshow = () => window.location.reload();
            });
          }}
        >
          <h3 className="text-slate-900  group-hover:text-white text-sm font-semibold">
            New project
          </h3>
        </div>
        <p className="text-slate-500 group-hover:text-white text-sm">
          Create a new project from a variety of starting templates.
        </p>
      </a>
    </Theme>
  );
}
