import { MiddlewareContext, ServerModule } from '@roxavn/core/server';
import { UnauthorizedException } from '@roxavn/core/base';
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
    const accessToken = await checkToken(token, dbSession);

    Object.assign(resp.locals, {
      $user: { id: accessToken.userId },
      $accessToken: { id: accessToken.id },
    });
  }
};

async function checkToken(
  token: string,
  dbSession: MiddlewareContext['dbSession']
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
  return accessToken;
}
