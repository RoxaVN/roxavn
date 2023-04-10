const path = require('node:path');
const fastify = require('fastify');
const {
  ServerModule,
  registerServerModules,
  databaseManager,
} = require('@roxavn/core/server');
const {
  sendRemixResponse,
  remixFastifyPlugin,
  createRemixRequest,
} = require('@roxavn/remix-fastify');

const CURRENT_DIR = process.cwd();

async function start() {
  const app = fastify();

  registerServerModules();
  app.setErrorHandler(function (error, request, reply) {
    const resp = ServerModule.handleError(error);
    sendRemixResponse(reply, resp);
  });
  const getLoadContext = (request) => ({
    getClientIp: () => request.ip,
    getRequestData: () =>
      Object.assign({}, request.params, request.query, request.body),
  });
  await app.register(remixFastifyPlugin, {
    build: path.join(CURRENT_DIR, '.web/build/index.js'),
    rootDir: path.join(CURRENT_DIR, '.web'),
    mode: process.env.NODE_ENV,
    getLoadContext: getLoadContext,
    purgeRequireCacheInDevelopment: false,
  });
  // register api routes
  ServerModule.apiRoutes.map((route) => {
    app.route({
      method: route.api.method.toUpperCase(),
      url: route.api.path,
      handler: async (request, reply) => {
        const remixReq = createRemixRequest(request, reply);
        const resp = await route.handler(remixReq, getLoadContext(request));
        sendRemixResponse(reply, resp);
      },
    });
  });
  await databaseManager.createSource();

  const port = process.env.PORT ? Number(process.env.PORT) || 3000 : 3000;
  return app.listen({ port, host: '0.0.0.0' });
}

start()
  .then((address) => console.log(`✅ App ready: ${address}`))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
