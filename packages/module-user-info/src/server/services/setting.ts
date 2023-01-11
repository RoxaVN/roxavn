import { ApiService } from '@roxavn/core/server';
import { InferApiRequest } from '@roxavn/core/share';
import {
  GetModuleSettingService,
  UpdateSettingService,
} from '@roxavn/module-utils/server';

import {
  getSettingsApi,
  setFieldsForUserToUpdateApi,
  setFieldsForAdminToUpdateApi,
  settingConstant,
} from '../../share';
import { serverModule } from '../module';

@serverModule.useApi(getSettingsApi)
export class GetSettingsService extends GetModuleSettingService {
  handle(request: InferApiRequest<typeof getSettingsApi>) {
    return super.handle({ ...request, module: serverModule.name });
  }
}

@serverModule.useApi(setFieldsForUserToUpdateApi)
export class SetFieldsForUserToUpdateService extends ApiService<
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
export class SetFieldsForAdminToUpdateService extends ApiService<
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
