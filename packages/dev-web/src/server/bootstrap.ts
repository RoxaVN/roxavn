import { broadcastDevReady, type ServerBuild } from '@remix-run/node';
import { constants } from '@roxavn/core/base';
import {
  type RemixLoaderContextHelper,
  ServerModule,
  moduleManager,
  serviceContainer,
  ApiSuccessJobManager,
  ApiErrorJobManager,
  ApiSuccessEventManager,
  ApiErrorEventManager,
} from '@roxavn/core/server';
import {
  createRemixRequest,
  remixFastifyPlugin,
  sendRemixResponse,
} from '@roxavn/remix-fastify';
import fastify, { type FastifyRequest } from 'fastify';
import path from 'path';

export async function bootstrap(serverBuild: ServerBuild) {
  await moduleManager.importServerModules();

  await (
    await serviceContainer.getAsync(ApiSuccessEventManager)
  ).registerServices();
  await (
    await serviceContainer.getAsync(ApiErrorEventManager)
  ).registerServices();

  await Promise.all(
    moduleManager.serverModules.map((m) => {
      return m.onBeforeServerStart && m.onBeforeServerStart();
    })
  );
  if (process.env.RUN_JOBS_CONSUMER) {
    await (
      await serviceContainer.getAsync(ApiSuccessJobManager)
    ).registerServices();
    await (
      await serviceContainer.getAsync(ApiErrorJobManager)
    ).registerServices();
  }

  const app = fastify();
  app.setErrorHandler(function (error, request, reply) {
    const resp: any = ServerModule.handleError(error);
    sendRemixResponse(reply, resp);
  });
  const getLoadContext = (
    request: FastifyRequest
  ): RemixLoaderContextHelper => ({
    getClientIp: () => request.ip,
    getRequestData: () =>
      Object.assign(
        {},
        request.params,
        request.query,
        // if send file, not update body
        request.body?.constructor.name === 'IncomingMessage'
          ? undefined
          : request.body
      ),
  });
  await app.register(remixFastifyPlugin, {
    build: serverBuild,
    rootDir: path.join(process.cwd(), '.web'),
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

  const port = process.env.PORT ? Number(process.env.PORT) || 3000 : 3000;
  const address = await app.listen({ port, host: '0.0.0.0' });

  if (process.env.NODE_ENV === constants.ENV_DEVELOPMENT) {
    broadcastDevReady(serverBuild);
  }

  moduleManager.serverModules.map((m) => {
    return m.onAfterServerStart && m.onAfterServerStart();
  });

  return address;
}
