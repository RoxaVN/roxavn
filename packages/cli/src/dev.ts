import nodemon from 'nodemon';
import { cli } from '@remix-run/dev';
import { constants } from '@roxavn/core/base';

class DevService {
  initEnv() {
    // set default environment
    Object.assign(process.env, {
      NODE_ENV: constants.ENV_DEVELOPMENT,
      DATABASE_URL: 'postgresql://admin:admin@localhost:5434/example',
      TOKEN_SIGN_SECRET: 'thisislongtokensecret',
    });
  }

  run() {
    this.initEnv();
    cli.run(['watch', '.web']);
    nodemon('.web/server.js');
  }
}

export const devService = new DevService();
