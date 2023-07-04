import { cli } from '@remix-run/dev';

class DevService {
  run() {
    cli.run(['dev', '.web', '-c', 'node .web/server.mjs']);
  }
}

export const devService = new DevService();
