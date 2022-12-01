import nodemon from 'nodemon';
import { cli } from '@remix-run/dev';

class DevService {
  run() {
    // set default environment
    process.env.DATABASE_URL =
      'postgresql://admin:admin@localhost:5434/example';

    cli.run(['watch', '.web']);
    nodemon('.web/server.ts');
  }
}

export const devService = new DevService();
