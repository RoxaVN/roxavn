import { NotFoundException } from '@roxavn/core/base';
import { BaseService } from '@roxavn/core/server';
import {
  GetSettingService,
  serverModule as utilsServerModule,
} from '@roxavn/module-utils/server';
import firebaseAdmin from 'firebase-admin';

import { constants } from '../../base';

export class GetFirebaseAppService extends BaseService {
  async handle(request: { projectId: string }) {
    const existsApp = firebaseAdmin.apps.find(
      (a) => a?.name === request.projectId
    );
    if (existsApp) {
      return existsApp;
    }
    const settings = await this.create(GetSettingService).handle({
      module: utilsServerModule.name,
      name: constants.FIREBASE_SERVER_SETTING,
    });
    if (settings && Array.isArray(settings.serviceAccounts)) {
      const projectSetting = settings.serviceAccounts.find(
        (s: any) => s.project_id === request.projectId
      );
      if (projectSetting) {
        return firebaseAdmin.initializeApp(
          {
            credential: firebaseAdmin.credential.cert(projectSetting),
          },
          request.projectId
        );
      }
    }
    throw new NotFoundException();
  }
}
