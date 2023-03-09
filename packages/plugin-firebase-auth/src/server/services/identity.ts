import { BadRequestException } from '@roxavn/core/base';
import { constants as userConstants } from '@roxavn/module-user/base';
import {
  IdentityService,
  serverModule as userServerModule,
} from '@roxavn/module-user/server';
import { GetSettingService } from '@roxavn/module-utils/server';
import firebaseAdmin from 'firebase-admin';

import { identityApi } from '../../base';
import { serverModule } from '../module';

serverModule.useRawApi(identityApi.verifyToken, async (request, context) => {
  const settings = await serverModule
    .createService(GetSettingService, context)
    .handle({
      module: userServerModule.name,
      name: 'constants.FIREBASE_SERVER_SETTING',
    });
  if (settings && Array.isArray(settings.serviceAccounts)) {
    const projectSetting = settings.serviceAccounts.find(
      (s: any) => s.project_id === request.projectId
    );
    if (projectSetting) {
      const existsApp = firebaseAdmin.apps.find(
        (a) => a?.name === request.projectId
      );
      const app = existsApp
        ? existsApp
        : firebaseAdmin.initializeApp(
            {
              credential: firebaseAdmin.credential.cert(projectSetting),
            },
            request.projectId
          );
      const user = await firebaseAdmin.auth(app).verifyIdToken(request.token);
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
    }
  }
  throw new BadRequestException();
});
