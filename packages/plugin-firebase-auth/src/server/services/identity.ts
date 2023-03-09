import { constants as userConstants } from '@roxavn/module-user/base';
import { IdentityService } from '@roxavn/module-user/server';
import { GetFirebaseAppService } from '@roxavn/plugin-firebase/server';
import firebaseAdmin from 'firebase-admin';

import { identityApi } from '../../base';
import { serverModule } from '../module';

serverModule.useRawApi(identityApi.verifyToken, async (request, context) => {
  const firebaseApp = await serverModule
    .createService(GetFirebaseAppService, context)
    .handle({ projectId: request.projectId });

  const user = await firebaseAdmin
    .auth(firebaseApp)
    .verifyIdToken(request.token);
  const data = {
    authenticator: 'firebase',
    ipAddress: context.req.ip,
    userAgent: context.req.headers['user-agent'],
  };
  const service = serverModule.createService(IdentityService, context);
  if (user.email_verified && user.email) {
    return service.handle({
      ...data,
      subject: user.email,
      type: userConstants.identityTypes.EMAIL,
    });
  } else if (user.phone_number) {
    return service.handle({
      ...data,
      subject: user.phone_number,
      type: userConstants.identityTypes.PHONE,
    });
  } else {
    return service.handle({
      ...data,
      subject: user.uid,
      type: 'firebase uid',
    });
  }
});
