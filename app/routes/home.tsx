import type { Route } from './+types/home';
import { Welcome } from '../welcome/welcome';
import { Outlet } from 'react-router';
import { Sider } from 'app/components/sider/sider';

export function meta(arg: Route.MetaArgs) {
  console.log(arg, 'arg');

  return [
    { title: 'XoX Note' },
    {
      property: 'og:title',
      content: 'XoX! Keep Note! Keeping log of life!',
    },
    {
      name: 'description',
      content: 'XoX is a note book human comfortable! using Ai!',
    },
  ];
}

export default function Home() {
  return (
    <div>
      <header>头部，用户信息，系统设置，记事本</header>
      <Sider />
      <Outlet />
    </div>
  );
}
