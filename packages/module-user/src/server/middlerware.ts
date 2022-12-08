import { BaseService, ServerModule } from '@roxavn/core/server';
import {
  Api,
  ForbiddenException,
  InferApiRequest,
  InferApiResponse,
  predefinedRoleManager,
  UnauthorizedException,
} from '@roxavn/core/share';
import { Raw } from 'typeorm';
import { UserAccessToken, UserRole } from './entities';
import { tokenService } from './services';

ServerModule.apiMiddlerwares.push(
  async (api, { dataSource, resp, req }, next) => {
    if (api.auth !== 'NOT_LOGGED') {
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

      const userId = tokenPart.split('.')[1];

      const accessToken = await dataSource
        .getRepository(UserAccessToken)
        .findOne({
          select: ['ownerId', 'id'],
          where: {
            ownerId: parseInt(userId),
            token: signature,
            expiredDate: Raw((alias) => `${alias} > NOW()`),
          },
        });

      if (!accessToken) {
        return next(new UnauthorizedException());
      }

      const { permission } = api;
      if (permission) {
        const predefinedRoles =
          await predefinedRoleManager.getRolesByPermission(permission);
        if (predefinedRoles.length === 0) {
          return next(new ForbiddenException());
        }

        const role = await dataSource.getRepository(UserRole).findOne({
          relations: { role: true },
          select: { id: true, role: {} },
          where: predefinedRoles.map((predefinedRole) => ({
            ownerId: accessToken.ownerId,
            role: {
              scope: predefinedRole.scope.type,
              name: predefinedRole.name,
            },
          })),
        });

        if (!role) {
          return next(new ForbiddenException());
        }
      }

      Object.assign(resp.locals, {
        user: { id: accessToken.ownerId },
        accessToken: { id: accessToken.id },
      } as AuthenticatedData);
    }
    next();
  }
);

type AuthenticatedData = {
  user: { id: number };
  accessToken: { id: number };
};

export type InferAuthApiRequest<T> = T extends Api<infer U, any, any>
  ? U & AuthenticatedData
  : never;

export abstract class AuthApiService<T extends Api> extends BaseService<
  InferApiRequest<T> & AuthenticatedData,
  InferApiResponse<T>
> {}