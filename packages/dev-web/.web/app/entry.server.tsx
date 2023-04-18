import { moduleManager } from '@roxavn/core/server';
import { handleRequest } from '@roxavn/dev-web/server';

try {
  const { serverModule } = require('../../src/server');
  if (serverModule) {
    moduleManager.serverModules.push(serverModule);
  }
} catch (e) {
  if (e?.code !== 'MODULE_NOT_FOUND') {
    console.log(e);
  }
}

export default handleRequest;
