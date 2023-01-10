import { ApiService } from '@roxavn/core/server';
import { InferApiRequest } from '@roxavn/core/share';
import {
  GetModuleSettingService,
  UpdateSettingService,
} from '@roxavn/module-utils/server';

import {
  GetSettingsApi,
  SetFieldsForUserToUpdateApi,
  SetFieldsForAdminToUpdateApi,
  settingConstant,
} from '../../share';
import { serverModule } from '../module';

@serverModule.useApi(GetSettingsApi)
export class GetSettingsService extends GetModuleSettingService {
  handle(request: InferApiRequest<typeof GetSettingsApi>) {
    return super.handle({ ...request, module: serverModule.name });
  }
}

@serverModule.useApi(SetFieldsForUserToUpdateApi)
export class SetFieldsForUserToUpdateService extends ApiService<
  typeof SetFieldsForUserToUpdateApi
> {
  handle(request: InferApiRequest<typeof SetFieldsForUserToUpdateApi>) {
    return this.create(UpdateSettingService).handle({
      module: serverModule.name,
      name: settingConstant.fieldsForUserToUpdate,
      metadata: { fields: request.fields },
    });
  }
}

@serverModule.useApi(SetFieldsForAdminToUpdateApi)
export class SetFieldsForAdminToUpdateService extends ApiService<
  typeof SetFieldsForAdminToUpdateApi
> {
  handle(request: InferApiRequest<typeof SetFieldsForAdminToUpdateApi>) {
    return this.create(UpdateSettingService).handle({
      module: serverModule.name,
      name: settingConstant.fieldsForAdminToUpdate,
      metadata: { fields: request.fields },
    });
  }
}
