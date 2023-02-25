import { ApiService } from '@roxavn/core/server';
import { InferApiRequest } from '@roxavn/core/base';
import { UpdateSettingService } from '@roxavn/module-utils/server';

import { settingApi, constants } from '../../base';
import { serverModule } from '../module';

@serverModule.useApi(settingApi.setFieldsForUserToUpdate)
export class SetFieldsForUserToUpdateApiService extends ApiService {
  handle(request: InferApiRequest<typeof settingApi.setFieldsForUserToUpdate>) {
    return this.create(UpdateSettingService).handle({
      module: serverModule.name,
      name: constants.FIELDS_FOR_USER_TO_UPDATE,
      metadata: { fields: request.fields },
      type: 'public',
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
      type: 'private',
    });
  }
}
