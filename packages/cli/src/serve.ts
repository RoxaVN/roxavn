import { cli } from '@remix-run/dev';
import path from 'path';

class ServeService {
  async run() {
    await cli.run(['build', '.web']);

    const serverModule = path.resolve('./.web/server.mjs');
    return import(serverModule);
  }
}

export const serveService = new ServeService();
