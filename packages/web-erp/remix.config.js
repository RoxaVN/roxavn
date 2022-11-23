const glob = require('glob');
const path = require('path');
const { modules } = require('./app.config');

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  serverDependenciesToBundle: [/^@roxavn/],
  routes: (defineRoutes) => {
    return defineRoutes((route) => {
      Object.keys(modules).forEach((module) => {
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
