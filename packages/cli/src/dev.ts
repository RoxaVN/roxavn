import nodemon from 'nodemon';
import { cli } from '@remix-run/dev';

class DevService {
  run() {
    // set default environment
    Object.assign(process.env, {
      DATABASE_URL: 'postgresql://admin:admin@localhost:5434/example',
      TOKEN_SIGN_SECRET: 'thisislongtokensecret',
    });

    cli.run(['watch', '.web']);
    nodemon('.web/server.ts');
  }
}

export const devService = new DevService();
