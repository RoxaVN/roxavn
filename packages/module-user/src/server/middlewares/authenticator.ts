import { AuthenticatedData, ServerModule } from '@roxavn/core/server';
import { Resource, UnauthorizedException } from '@roxavn/core/base';
import snakeCase from 'lodash/snakeCase';
import { Raw } from 'typeorm';
import { AccessToken } from '../entities';
import { tokenService } from '../services';

// authenticate access token
ServerModule.authenticatorMiddleware = async (
  api,
  { dbSession, resp, req }
) => {
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
      $getResource: async () => {
        if ('$resource' in resp.locals) {
          return resp.locals.$resource;
        }
        let resource: Resource | undefined;
        let result = null;
        for (const r of api.resources.reverse()) {
          if (resp.locals[r.idParam]) {
            resource = r;
            break;
          }
        }
        if (resource) {
          const resourceTable = snakeCase(resource.name);
          result = await dbSession
            .createQueryBuilder()
            .select(resourceTable)
            .from(resourceTable, resourceTable)
            .where(`${resourceTable}.id = :id`, {
              id: resp.locals[resource.idParam],
            })
            .getOne();
        }
        resp.locals.$resource = result;
        return result;
      },
    } as AuthenticatedData);
  }
};
