import { registerWebRoutes } from '@roxavn/core/server';

/** @type {import('@remix-run/dev').AppConfig} */
const appConfig = {
  ignoredRouteFiles: ['**/.*'],
  watchPaths: ['./src/**/*'],
  serverModuleFormat: 'esm',
  serverBuildPath: 'build/index.mjs',
  future: {
    unstable_dev: true,
    v2_routeConvention: true,
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
  },
  routes: (defineRoutes) => registerWebRoutes(defineRoutes),
};

export default appConfig;
