import {
  type ServerLoaderContextHelper,
  ServerModule,
  databaseManager,
  registerServerModules,
} from '@roxavn/core/server';
import {
  createRemixRequest,
  remixFastifyPlugin,
  sendRemixResponse,
} from '@roxavn/remix-fastify';
import fastify, { type FastifyRequest } from 'fastify';
import path from 'path';

export async function bootstrap(currentDir: string) {
  const app = fastify();

  registerServerModules();
  app.setErrorHandler(function (error, request, reply) {
    const resp: any = ServerModule.handleError(error);
    sendRemixResponse(reply, resp);
  });
  const getLoadContext = (
    request: FastifyRequest
  ): ServerLoaderContextHelper => ({
    getClientIp: () => request.ip,
    getRequestData: () =>
      Object.assign({}, request.params, request.query, request.body),
  });
  await app.register(remixFastifyPlugin, {
    build: path.join(currentDir, '.web/build/index.js'),
    rootDir: path.join(currentDir, '.web'),
    mode: process.env.NODE_ENV,
    getLoadContext: getLoadContext as any,
    purgeRequireCacheInDevelopment: false,
  });
  // register api routes
  ServerModule.apiRoutes.forEach((route) => {
    app.route({
      method: route.api.method.toUpperCase() as any,
      url: route.api.path,
      handler: async (request, reply) => {
        const remixReq = createRemixRequest(request, reply);
        const resp: any = await route.handler(
          remixReq,
          getLoadContext(request)
        );
        sendRemixResponse(reply, resp);
      },
    });
  });
  await databaseManager.createSource();

  const port = process.env.PORT ? Number(process.env.PORT) || 3000 : 3000;
  return app.listen({ port, host: '0.0.0.0' });
}
