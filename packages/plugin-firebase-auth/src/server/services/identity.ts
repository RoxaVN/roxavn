import { BadRequestException, InferApiRequest } from '@roxavn/core/base';
import { ApiService } from '@roxavn/core/server';
import { constants as userConstants } from '@roxavn/module-user/base';
import {
  IdentityService,
  serverModule as userServerModule,
} from '@roxavn/module-user/server';
import { GetSettingService } from '@roxavn/module-utils/server';
import firebaseAdmin from 'firebase-admin';

import { constants, identityApi } from '../../base';
import { serverModule } from '../module';

@serverModule.useApi(identityApi.verifyToken)
export class VerifyTokenApiService extends ApiService {
  async handle(request: InferApiRequest<typeof identityApi.verifyToken>) {
    const settings = await this.create(GetSettingService).handle({
      module: userServerModule.name,
      name: constants.FIREBASE_SERVER_SETTING,
    });
    if (settings && Array.isArray(settings.serviceAccounts)) {
      const serviceAccounts = settings.serviceAccounts.map((s: any) =>
        JSON.parse(s)
      );
      const projectSetting = serviceAccounts.find(
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
        let data: { subject: string; type: string; authenticator: string };
        if (user.email_verified && user.email) {
          data = {
            subject: user.email,
            type: userConstants.identityTypes.EMAIL,
            authenticator: 'firebase',
          };
        } else if (user.phone_number) {
          data = {
            subject: user.phone_number,
            type: userConstants.identityTypes.PHONE,
            authenticator: 'firebase',
          };
        } else {
          data = {
            subject: user.uid,
            type: 'firebase uid',
            authenticator: 'firebase',
          };
        }
        return await this.create(IdentityService).handle(data);
      }
    }
    throw new BadRequestException();
  }
}
