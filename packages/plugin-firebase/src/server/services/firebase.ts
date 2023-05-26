import { NotFoundException } from '@roxavn/core/base';
import { BaseService, inject } from '@roxavn/core/server';
import {
  GetSettingService,
  serverModule as utilsServerModule,
} from '@roxavn/module-utils/server';
import firebaseAdmin from 'firebase-admin';

import { constants } from '../../base/index.js';
import { serverModule } from '../module.js';

@serverModule.injectable()
export class GetFirebaseAppService extends BaseService {
  constructor(
    @inject(GetSettingService) private getSettingService: GetSettingService
  ) {
    super();
  }

  async handle(request: { projectId: string }) {
    const existsApp = firebaseAdmin.apps.find(
      (a) => a?.name === request.projectId
    );
    if (existsApp) {
      return existsApp;
    }
    const settings = await this.getSettingService.handle({
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
