import nodemon from 'nodemon';
import { cli } from '@remix-run/dev';

class DevService {
  initEnv() {
    // set default environment
    Object.assign(process.env, {
      SEAWEED_USE_PUBLIC_URL: 'true',
      SEAWEED_MASTER_URL: 'http://localhost:9333',
      DATABASE_URL: 'postgresql://admin:admin@localhost:5434/example',
      TOKEN_SIGN_SECRET: 'thisislongtokensecret',
    });
  }

  run() {
    this.initEnv();
    cli.run(['watch', '.web']);
    nodemon('.web/server.ts');
  }
}

export const devService = new DevService();
