const { registerWebRoutes } = require('@roxavn/core/server');

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  watchPaths: ['./src/**/*'],
  server: '.web/server.ts',
  routes: (defineRoutes) => registerWebRoutes(defineRoutes),
};
