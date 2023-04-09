import {
  remixFastifyPlugin,
  sendRemixResponse,
  createRemixRequest,
} from '@roxavn/remix-fastify';
import * as serverBuild from '@remix-run/dev/server-build';
import { registerServerModules, ServerModule } from '@roxavn/core/server';
import fastify from 'fastify';

async function start() {
  const app = fastify();

  registerServerModules();
  app.setErrorHandler(function (error, request, reply) {
    const resp: any = ServerModule.handleError(error);
    sendRemixResponse(reply, resp);
  });
  ServerModule.apiRoutes.map((route) => {
    app.route({
      method: route.api.method.toUpperCase() as any,
      url: route.api.path,
      handler: async (request, reply) => {
        const remixReq = createRemixRequest(request, reply);
        const resp: any = await route.handler(remixReq, {
          getClientIp: () => request.ip,
          getRequestData: () =>
            Object.assign({}, request.params, request.query || request.body),
        });
        sendRemixResponse(reply, resp);
      },
    });
  });

  await app.register(remixFastifyPlugin, {
    assetsBuildDirectory: serverBuild.assetsBuildDirectory,
    build: serverBuild,
    mode: process.env.NODE_ENV,
    publicPath: serverBuild.publicPath,
  } as any);

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  return app.listen({ port, host: '0.0.0.0' });
}

start()
  .then((address) => {
    console.log(`server listening at ${address}`);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
