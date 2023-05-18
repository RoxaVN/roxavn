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
    cli.run(['dev', '.web', '-c', 'node .web/server.mjs']);
  }
}

export const devService = new DevService();
