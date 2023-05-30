import { type InferApiRequest } from '@roxavn/core/base';
import {
  BaseService,
  type InferContext,
  Ip,
  inject,
  UserAgent,
} from '@roxavn/core/server';
import { constants as userConstants } from '@roxavn/module-user/base';
import { IdentityService } from '@roxavn/module-user/server';
import { GetFirebaseAppService } from '@roxavn/plugin-firebase/server';
import firebaseAdmin from 'firebase-admin';

import { identityApi } from '../../base/index.js';
import { serverModule } from '../module.js';

@serverModule.useApi(identityApi.verifyToken)
export class VerifytokenFirebaseService extends BaseService {
  constructor(
    @inject(GetFirebaseAppService)
    private getFirebaseAppService: GetFirebaseAppService,
    @inject(IdentityService)
    private identityService: IdentityService
  ) {
    super();
  }

  async handle(
    request: InferApiRequest<typeof identityApi.verifyToken>,
    @Ip ipAddress: InferContext<typeof Ip>,
    @UserAgent userAgent: InferContext<typeof UserAgent>
  ) {
    const firebaseApp = await this.getFirebaseAppService.handle({
      projectId: request.projectId,
    });

    const user = await firebaseAdmin
      .auth(firebaseApp)
      .verifyIdToken(request.token);
    const data = {
      authenticator: 'firebase',
      ipAddress,
      userAgent,
    };
    if (user.email_verified && user.email) {
      return this.identityService.handle({
        ...data,
        subject: user.email,
        type: userConstants.identityTypes.EMAIL,
      });
    } else if (user.phone_number) {
      return this.identityService.handle({
        ...data,
        subject: user.phone_number,
        type: userConstants.identityTypes.PHONE,
      });
    } else {
      return this.identityService.handle({
        ...data,
        subject: user.uid,
        type: 'firebase uid',
      });
    }
  }
}
