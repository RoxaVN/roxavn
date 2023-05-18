import { bootstrap } from '@roxavn/dev-web/server';

import * as serverBuild from './build/index.mjs';

bootstrap(serverBuild)
  .then((address) => console.log(`✅ App ready: ${address}`))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
