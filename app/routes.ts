import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  route('/', 'routes/home.tsx', [
    index('routes/home-nav.tsx'),
    route('note/:mode?', 'routes/note.tsx',[
        route('grid', 'routes/note-grid.tsx'),
        // route('date-groups', 'routes/note-view.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
