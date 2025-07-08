import { RouteObject } from 'react-router-dom';
import { routes } from './router';
import RootLayout from '../layouts/RootLayout';

// Extend RouteObject to include optional meta property
// interface RouteMeta {
//   isMobile?: boolean;
//   [key: string]: any;
// }
// type CustomRouteObject = RouteObject & {
//   meta?: RouteMeta;
// };
// export const generateRoutes = (isMobile: boolean): RouteObject[] => {
//  const childRoutes = (routes as CustomRouteObject[]).filter(route => {
//     if (route.meta && route.meta.isMobile !== undefined) {
//       return route.meta.isMobile === isMobile;
//     }
//     return true; // 没有 meta 信息的路由都显示
//   });

//   return [
//     {
//       path: '/',
//       element: <RootLayout>{childRoutes.map(route => route.element)}</RootLayout>,
//       children: childRoutes,
//     },
//   ];
// };



interface RouteMeta {
  isMobile?: boolean;
  [key: string]: any;
}
type CustomRouteObject = RouteObject & {
  meta?: RouteMeta;
};
export const generateRoutes = (isMobile: boolean): RouteObject[] => {
  return [
    {
      path: '/',
      element: <RootLayout/>,
      children: (routes as CustomRouteObject[]).filter(route => {
        if (route.meta && route.meta.isMobile !== undefined) {
          return route.meta.isMobile === isMobile;
        }
        return true; // 没有 meta 信息的路由都显示
      }),
    },
  ];
};

// export const generateRoutes = (isMobile: boolean): CustomRouteObject[] => {
//   return (routes as CustomRouteObject[]).filter(route => {
//     if (route.meta && route.meta.isMobile !== undefined) {
//       return route.meta.isMobile === isMobile;
//     }
//     return true; // 没有 meta 信息的路由都显示
//   });
// };