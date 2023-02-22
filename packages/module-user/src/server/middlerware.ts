import { BaseService, ServerModule } from '@roxavn/core/server';
import {
  Api,
  ForbiddenException,
  InferApiRequest,
  InferApiResponse,
  NotFoundException,
  Resource,
  UnauthorizedException,
} from '@roxavn/core/base';
import { Raw, ArrayContains, In } from 'typeorm';
import { AccessToken, UserRole } from './entities';
import { tokenService } from './services/token';
import { constants, Resources, Scopes } from '../base';

type AuthenticatedData = {
  $user: { id: string };
  $accessToken: { id: string };
};

export type InferAuthApiRequest<T> = T extends Api<infer U, any, any>
  ? U & AuthenticatedData
  : never;

export abstract class AuthApiService<T extends Api = Api> extends BaseService<
  InferApiRequest<T> & AuthenticatedData,
  InferApiResponse<T>
> {}

// authenticate access token
ServerModule.apiMiddlewares.push(async (api, { dbSession, resp, req }) => {
  if (api.permission) {
    const authorizationHeader = req.get('authorization');
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const token = authorizationHeader.slice(7);
    if (!token) {
      throw new UnauthorizedException();
    }

    const signatureIndex = token.lastIndexOf('.');
    if (signatureIndex < 0) {
      throw new UnauthorizedException();
    }

    const signature = token.slice(signatureIndex + 1);
    const tokenPart = token.slice(0, signatureIndex);
    const isValid = await tokenService.signer.verify(tokenPart, signature);
    if (!isValid) {
      throw new UnauthorizedException();
    }

    const userId = tokenPart.split('.')[1];

    const accessToken = await dbSession.getRepository(AccessToken).findOne({
      select: ['userId', 'id'],
      where: {
        userId: userId,
        token: signature,
        expiredDate: Raw((alias) => `${alias} > NOW()`),
      },
    });

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    Object.assign(resp.locals, {
      $user: { id: accessToken.userId },
      $accessToken: { id: accessToken.id },
    } as AuthenticatedData);
  }
});

// check permission user
ServerModule.apiMiddlewares.push(async (api, { dbSession, resp, req }) => {
  if (api.permission) {
    const user: AuthenticatedData['$user'] = resp.locals.$user;
    const scopeHeader = req.get(constants.AUTH_SCOPE_HTTP_HEADER);
    if (scopeHeader === constants.ADMIN_AUTH_SCOPE) {
      const allow = await dbSession.getRepository(UserRole).count({
        where: {
          userId: user.id,
          role: {
            hasId: false,
            scope: In(
              api.permission.allowedScopes
                .filter((s) => !s.idParam)
                .map((s) => s.name)
            ),
            permissions: ArrayContains([api.permission.value]),
          },
        },
      });
      if (!allow) {
        throw new ForbiddenException();
      }
    } else {
      const hasOwner = !!api.permission.allowedScopes.find(
        (r) => r.name === Scopes.Owner.name
      );
      if (hasOwner) {
        if (resp.locals[Resources.User.idParam] === user.id) {
          return;
        }
      }
      const lastResource = api.resources[api.resources.length - 1];
      const allowResources: Resource[] = api.permission.allowedScopes.filter(
        (s) => s.idParam
      ) as any;
      const scopeIds: string[] = allowResources
        .map((r) => resp.locals[r.idParam])
        .filter((i) => i);
      if (allowResources.length === 1) {
        if (scopeIds.length === 1) {
          const allow = await dbSession.getRepository(UserRole).count({
            where: {
              userId: user.id,
              scopeId: scopeIds[0],
              role: {
                hasId: true,
                scope: allowResources[0].name,
                permissions: ArrayContains([api.permission.value]),
              },
            },
          });
          if (!allow) {
            throw new ForbiddenException();
          }
        } else {
          const resourceTable = lastResource.idParam.replace('Id', '');
          const resource = await dbSession
            .createQueryBuilder()
            .select(resourceTable)
            .from(resourceTable, resourceTable)
            .where(`${resourceTable}.id = :id`, {
              id: resp.locals[lastResource.idParam],
            })
            .getOne();
          if (resource) {
            if (hasOwner && resource.userId === user.id) {
              return;
            }
            const allow = await dbSession.getRepository(UserRole).count({
              where: {
                userId: user.id,
                scopeId: resource[allowResources[0].idParam],
                role: {
                  hasId: true,
                  scope: allowResources[0].name,
                  permissions: ArrayContains([api.permission.value]),
                },
              },
            });
            if (!allow) {
              throw new ForbiddenException();
            }
          } else {
            throw new NotFoundException();
          }
        }
      } else {
        throw Error(
          `Too many resources [${allowResources
            .map((r) => r.name)
            .join(', ')}] for api ${api.path}`
        );
      }
    }
  }
});
