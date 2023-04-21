import { ForbiddenException } from '@roxavn/core/base';
import { AuthenticatedData, authorizationManager } from '@roxavn/core/server';
import { ArrayContains, In } from 'typeorm';
import { constants } from '../../base';
import { UserRole } from '../entities';

// check in admin pages
authorizationManager.middlewares.push({
  apiMatcher: /./,
  priority: 2,
  handler: async ({ api, dbSession, state, request }) => {
    const user: AuthenticatedData['$user'] = state.$user;
    const scopeHeader = request.headers.get(constants.AUTH_SCOPE_HTTP_HEADER);
    if (scopeHeader === constants.ADMIN_AUTH_SCOPE) {
      const allow = await dbSession.getRepository(UserRole).count({
        where: {
          userId: user.id,
          role: {
            hasId: false,
            scope: In(
              api.permission.allowedScopes
                .filter((s) => !s.idParam)
                .map((s) => (s.dynamicName ? s.dynamicName(state) : s.name))
            ),
            permissions: ArrayContains([api.permission.name]),
          },
        },
      });
      if (!allow) {
        throw new ForbiddenException();
      }
      return true;
    }
    return false;
  },
});

// check in resource scope
authorizationManager.middlewares.push({
  apiMatcher: /./,
  priority: 2,
  handler: async ({ api, dbSession, state, helper }) => {
    const data: AuthenticatedData = state as any;
    const resource = await helper.getResourceInstance();
    const scopes = api.permission.allowedScopes
      .map((s) => ({
        name: s.dynamicName ? s.dynamicName(state, resource) : s.name,
        id:
          s.idParam && (state[s.idParam] || (resource && resource[s.idParam])),
      }))
      .filter((s) => s.id);

    if (scopes.length < 1) {
      return false;
    }

    const allow = await dbSession.getRepository(UserRole).count({
      where: scopes.map((scope) => ({
        userId: data.$user.id,
        scopeId: scope.id,
        role: {
          hasId: true,
          scope: scope.name,
          permissions: ArrayContains([api.permission.name]),
        },
      })),
    });
    return !!allow;
  },
});
