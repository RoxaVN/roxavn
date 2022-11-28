const { defineModuleRoutes } = require('@roxavn/core/server');

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  serverDependenciesToBundle: [/^@roxavn/],
  watchPaths: ['./src/**/*'],
  routes: (defineRoutes) => defineModuleRoutes(defineRoutes),
};
