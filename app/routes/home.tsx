import type { Route } from './+types/home';
import { Welcome } from '../welcome/welcome';
import { Outlet } from 'react-router';

export function meta() {
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
  return <div>
    <Outlet />
  </div>;
}
