const glob = require('glob');
const path = require('path');
const { getJsonFromFile } = require('@roxavn/core/server');

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  serverDependenciesToBundle: [/^@roxavn/],
  routes: (defineRoutes) => {
    return defineRoutes((route) => {
      const appConfig = getJsonFromFile('.app.config.json');
      Object.keys(appConfig.modules).forEach((module) => {
        try {
          const pathToModule = path.dirname(require.resolve(module + '/web'));
          glob.sync(pathToModule + '/pages/**/*.js').map((file) => {
            const pathName = file
              .split('/web/pages')[1]
              .replace('.js', '')
              .replace(/index$/, '');
            route(pathName, path.relative('./app', file));
          });
        } catch (e) {}
      });
    });
  },
};
