import { ApiService } from '@roxavn/core/server';
import { InferApiRequest } from '@roxavn/core/base';
import {
  GetModuleSettingService,
  UpdateSettingService,
} from '@roxavn/module-utils/server';

import { settingApi, constants } from '../../base';
import { serverModule } from '../module';

@serverModule.useApi(settingApi.getAll)
export class GetSettingsApiService extends ApiService {
  handle(request: InferApiRequest<typeof settingApi.getAll>) {
    return this.create(GetModuleSettingService).handle({
      ...request,
      module: serverModule.name,
    });
  }
}

@serverModule.useApi(settingApi.setFieldsForUserToUpdate)
export class SetFieldsForUserToUpdateApiService extends ApiService {
  handle(request: InferApiRequest<typeof settingApi.setFieldsForUserToUpdate>) {
    return this.create(UpdateSettingService).handle({
      module: serverModule.name,
      name: constants.FIELDS_FOR_USER_TO_UPDATE,
      metadata: { fields: request.fields },
    });
  }
}

@serverModule.useApi(settingApi.setFieldsForAdminToUpdate)
export class SetFieldsForAdminToUpdateApiService extends ApiService {
  handle(
    request: InferApiRequest<typeof settingApi.setFieldsForAdminToUpdate>
  ) {
    return this.create(UpdateSettingService).handle({
      module: serverModule.name,
      name: constants.FIELDS_FOR_ADMIN_TO_UPDATE,
      metadata: { fields: request.fields },
    });
  }
}
