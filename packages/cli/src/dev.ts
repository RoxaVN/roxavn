import nodemon from 'nodemon';
import { cli } from '@remix-run/dev';

class DevService {
  run() {
    cli.run(['watch', '.web']);
    nodemon('.web/server.ts');
  }
}

export const devService = new DevService();
