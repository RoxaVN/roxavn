import { ApiService } from '@roxavn/core/server';
import { InferApiRequest } from '@roxavn/core/share';
import {
  GetModuleSettingService,
  UpdateSettingService,
} from '@roxavn/module-utils/server';

import {
  GetSettingsApi,
  SetFieldsForUserToUpdateApi,
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
    const service = this.create(UpdateSettingService);
    return service.handle({
      module: serverModule.name,
      name: settingConstant.fieldsForUserToUpdate,
      metadata: { fields: request.fields },
    });
  }
}
