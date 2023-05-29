import {
  ApiAuthenticatorMiddleware,
  InjectDatabaseService,
  LoaderAuthenticatorMiddleware,
  MiddlewareService,
  RouterContext,
} from '@roxavn/core/server';
import { Cookie, constants } from '@roxavn/core/base';
import { EntityManager, Raw } from 'typeorm';
import { AccessToken } from '../entities/index.js';
import { tokenService } from '../services/token.js';
import { serverModule } from '../module.js';

@serverModule.rebind(ApiAuthenticatorMiddleware)
export class ApiAuthenticatorMiddlewareEx
  extends InjectDatabaseService
  implements MiddlewareService
{
  async handle(
    { api, state, request }: RouterContext,
    next: () => Promise<void>
  ) {
    if (api?.permission) {
      const authorizationHeader = request.headers.get('authorization');
      const token =
        authorizationHeader && authorizationHeader.startsWith('Bearer ')
          ? authorizationHeader.slice(7)
          : null;
      await checkToken(token, this.databaseService.manager, state);
    }
    return next();
  }
}

@serverModule.rebind(LoaderAuthenticatorMiddleware)
export class LoaderAuthenticatorMiddlewareEx
  extends InjectDatabaseService
  implements MiddlewareService
{
  async handle(
    { api, state, request }: RouterContext,
    next: () => Promise<void>
  ) {
    if (api?.permission) {
      const cookie = request.headers.get('cookie');
      const token = cookie
        ? new Cookie(cookie).get(constants.Cookie.TOKEN)
        : null;
      await checkToken(token, this.databaseService.manager, state);
    }
    return next();
  }
}

async function checkToken(
  token: string | null,
  dbSession: EntityManager,
  state: Record<string, any>
) {
  if (!token) {
    return;
  }

  const signatureIndex = token.lastIndexOf('.');
  if (signatureIndex < 0) {
    return;
  }

  const signature = token.slice(signatureIndex + 1);
  const tokenPart = token.slice(0, signatureIndex);
  const isValid = await tokenService.signer.verify(tokenPart, signature);
  if (!isValid) {
    return;
  }

  const userId = tokenPart.split('.')[1];

  const accessToken: { userId: string; id: string } | null = await dbSession
    .getRepository(AccessToken)
    .findOne({
      select: ['userId', 'id'],
      where: {
        userId: userId,
        token: signature,
        expiryDate: Raw((alias) => `${alias} > NOW()`),
      },
      cache: {
        id: 'getAccessToken',
        milliseconds: 60000, // 1 minute
      },
    });

  if (!accessToken) {
    return;
  }

  Object.assign(state, {
    user: { id: accessToken.userId },
    accessToken: { id: accessToken.id },
  });
}
