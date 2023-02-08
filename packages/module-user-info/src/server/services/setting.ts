import { ApiService } from '@roxavn/core/server';
import { InferApiRequest } from '@roxavn/core/base';
import {
  GetModuleSettingService,
  UpdateSettingService,
} from '@roxavn/module-utils/server';

import {
  getSettingsApi,
  setFieldsForUserToUpdateApi,
  setFieldsForAdminToUpdateApi,
  settingConstant,
} from '../../base';
import { serverModule } from '../module';

@serverModule.useApi(getSettingsApi)
export class GetSettingsApiService extends ApiService<typeof getSettingsApi> {
  handle(request: InferApiRequest<typeof getSettingsApi>) {
    return this.create(GetModuleSettingService).handle({
      ...request,
      module: serverModule.name,
    });
  }
}

@serverModule.useApi(setFieldsForUserToUpdateApi)
export class SetFieldsForUserToUpdateApiService extends ApiService<
  typeof setFieldsForUserToUpdateApi
> {
  handle(request: InferApiRequest<typeof setFieldsForUserToUpdateApi>) {
    return this.create(UpdateSettingService).handle({
      module: serverModule.name,
      name: settingConstant.fieldsForUserToUpdate,
      metadata: { fields: request.fields },
    });
  }
}

@serverModule.useApi(setFieldsForAdminToUpdateApi)
export class SetFieldsForAdminToUpdateApiService extends ApiService<
  typeof setFieldsForAdminToUpdateApi
> {
  handle(request: InferApiRequest<typeof setFieldsForAdminToUpdateApi>) {
    return this.create(UpdateSettingService).handle({
      module: serverModule.name,
      name: settingConstant.fieldsForAdminToUpdate,
      metadata: { fields: request.fields },
    });
  }
}
