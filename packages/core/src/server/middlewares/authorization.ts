import { ForbiddenException, UnauthorizedException } from '../../base/index.js';
import { serviceManager } from '../service/manager.js';
import { authorize } from './authorize.js';
import { ServerMiddleware } from './interfaces.js';

export const authorizationMiddleware: ServerMiddleware = async ({
  api,
  state,
  helper,
  dbSession,
}) => {
  if (api) {
    const result = await authorize({
      api: api,
      request: state.request,
      helper: {
        getRelatedResourceInstance: helper.getRelatedResourceInstance,
        getResourceInstance: helper.getResourceInstance,
        hasPermission: (...args) => {
          return serviceManager.checkUserPermission(dbSession, ...args);
        },
      },
    });
    if (!result) {
      if (state.request.$user) {
        throw new ForbiddenException();
      }
      throw new UnauthorizedException();
    }
  }
};
