import { moduleManager } from '@roxavn/core/server';
import { handleRequest } from '@roxavn/dev-web/server';

moduleManager.currentServerModuleImporter = () => {
  return import('../../src/server');
};

export default handleRequest;
