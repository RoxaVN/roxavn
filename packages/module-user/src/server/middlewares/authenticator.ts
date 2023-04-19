import { ServerLoaderArgs, ServerModule } from '@roxavn/core/server';
import { Cookie, UnauthorizedException, constants } from '@roxavn/core/base';
import { Raw } from 'typeorm';
import { AccessToken } from '../entities';
import { tokenService } from '../services';

// authenticate access token
ServerModule.authenticatorMiddleware = async ({
  dbSession,
  state,
  request,
  api,
}) => {
  if (api?.permission) {
    const authorizationHeader = request.headers.get('authorization');
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const token = authorizationHeader.slice(7);
    await checkToken(token, dbSession, state);
  }
};

ServerModule.authenticatorLoaderMiddleware = async ({
  dbSession,
  request,
  state,
  api,
}) => {
  if (api?.permission) {
    const cookie = request.headers.get('cookie');
    const token = cookie
      ? new Cookie(cookie).get(constants.Cookie.TOKEN)
      : null;
    await checkToken(token, dbSession, state);
  }
};

async function checkToken(
  token: string | null,
  dbSession: ServerLoaderArgs['dbSession'],
  state: Record<string, any>
) {
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

  const accessToken: { userId: string; id: string } | null = await dbSession
    .getRepository(AccessToken)
    .findOne({
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

  Object.assign(state, {
    $user: { id: accessToken.userId },
    $accessToken: { id: accessToken.id },
  });
}
