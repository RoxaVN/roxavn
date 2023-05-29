import { inject } from 'inversify';
import { uniqBy } from 'lodash-es';
import {
  ForbiddenException,
  Resource,
  UnauthorizedException,
} from '../../base/index.js';
import { CheckUserPermissionService, RouterContext } from '../service/index.js';

import {
  ApiAuthenticatorMiddleware,
  LoaderAuthenticatorMiddleware,
} from './authenticator.js';
import { ResourceService } from './helper.js';
import { MiddlewareService } from './interfaces.js';
import { useApiMiddleware, useLoaderMiddleware } from './manager.js';

@useApiMiddleware()
@useLoaderMiddleware()
export class AuthorizationMiddleware implements MiddlewareService {
  after = [ApiAuthenticatorMiddleware, LoaderAuthenticatorMiddleware];

  constructor(
    @inject(ResourceService) private resourceService: ResourceService,
    @inject(CheckUserPermissionService)
    private checkUserPermissionService: CheckUserPermissionService
  ) {}

  async checkcondition({ api, state }: RouterContext) {
    if (api && api.permission) {
      const conditionResources: Resource[] =
        api.permission.allowedScopes.filter((r) => 'condition' in r) as any;
      for (const resource of conditionResources) {
        if (resource.condition) {
          const relatedResource =
            await this.resourceService.getRelatedResourceInstance(
              api,
              state,
              resource
            );
          const isValid = resource.condition(state.request, {
            user: state.user,
            resource: relatedResource,
          });
          if (isValid) {
            return true;
          }
        }
      }
      return false;
    }
    return true;
  }

  async checkPermission({ api, state }: RouterContext) {
    if (api && api.permission) {
      const user = state.user;
      const request = state.request;
      if (user) {
        const resource = await this.resourceService.getResourceInstance(
          api,
          state
        );
        let scopes = api.permission.allowedScopes
          .filter((s) => !s.condition)
          .map((s) => ({
            name: s.dynamicName ? s.dynamicName(request) : s.name,
            id:
              s.idParam &&
              (request[s.idParam] || (resource && resource[s.idParam])),
          }));

        if (scopes.length) {
          scopes = uniqBy(scopes, (item) => item.name);
          return await this.checkUserPermissionService.handle({
            userId: user.id,
            permission: api.permission.name,
            scopes,
          });
        }
      }
      return false;
    }
    return true;
  }

  async handle(context: RouterContext, next: () => Promise<void>) {
    if (
      (await this.checkcondition(context)) ||
      (await this.checkPermission(context))
    ) {
      return next();
    }
    if (context.state.user) {
      throw new ForbiddenException();
    }
    throw new UnauthorizedException();
  }
}
