import { ServerModule, MiddlerwareContext } from '@roxavn/core/server';
import {
  Api,
  ForbiddenException,
  predefinedRoleManager,
  scopeManager,
  UnauthorizedException,
} from '@roxavn/core/base';
import { Raw } from 'typeorm';
import { AccessToken, UserRole } from './entities';
import { tokenService } from './services/token';
import { Resources } from '../base';

function checkOwner(api: Api, { req }: MiddlerwareContext, userId: number) {
  if (api.resources.find((r) => r.name === scopeManager.OWNER.name)) {
    if (api.resources.find((r) => r.name === Resources.User.name)) {
      if (req.params[Resources.User.idParam] === userId.toString()) {
        return true;
      }
    }
  }
  return false;
}

async function checkRole(
  api: Api,
  { dbSession, req }: MiddlerwareContext,
  userId: number
) {
  if (api.permission) {
    const predefinedRoles = await predefinedRoleManager.getRolesByPermission(
      api.permission
    );
    if (predefinedRoles.length === 0) {
      return false;
    }

    const hasRole = await dbSession.getRepository(UserRole).count({
      where: predefinedRoles.map((predefinedRole) => ({
        userId: userId,
        scopeId: predefinedRole.scope.idParam
          ? req.params[predefinedRole.scope.idParam]
          : '',
        role: {
          scope: predefinedRole.scope.name,
          name: predefinedRole.name,
        },
      })),
    });
    return !!hasRole;
  }
  return true;
}

ServerModule.apiMiddlerwares.push(
  async (api, { dbSession, resp, req }, next) => {
    if (api.permission) {
      const authorizationHeader = req.get('authorization');
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return next(new UnauthorizedException());
      }

      const token = authorizationHeader.slice(7);
      if (!token) {
        return next(new UnauthorizedException());
      }

      const signatureIndex = token.lastIndexOf('.');
      if (signatureIndex < 0) {
        return next(new UnauthorizedException());
      }

      const signature = token.slice(signatureIndex + 1);
      const tokenPart = token.slice(0, signatureIndex);
      const isValid = await tokenService.signer.verify(tokenPart, signature);
      if (!isValid) {
        return next(new UnauthorizedException());
      }

      const userId = parseInt(tokenPart.split('.')[1]);

      const accessToken = await dbSession.getRepository(AccessToken).findOne({
        select: ['userId', 'id'],
        where: {
          userId: userId,
          token: signature,
          expiredDate: Raw((alias) => `${alias} > NOW()`),
        },
      });

      if (!accessToken) {
        return next(new UnauthorizedException());
      }

      const allow =
        checkOwner(api, { dbSession, req, resp }, userId) ||
        checkRole(api, { dbSession, req, resp }, userId);
      if (!allow) {
        return next(new ForbiddenException());
      }

      Object.assign(resp.locals, {
        $user: { id: accessToken.userId },
        $accessToken: { id: accessToken.id },
      } as AuthenticatedData);
    }
    next();
  }
);

type AuthenticatedData = {
  $user: { id: number };
  $accessToken: { id: number };
};
