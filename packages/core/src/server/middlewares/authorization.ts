import { ForbiddenException, UnauthorizedException } from '../../base';
import { serviceManager } from '../service';
import { authorize } from './authorize';
import { ServerMiddleware } from './interfaces';

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
