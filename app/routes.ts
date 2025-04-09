import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [route('/', 'routes/home.tsx', [
    route(':mode?', 'routes/mode.tsx')
])] satisfies RouteConfig;  
