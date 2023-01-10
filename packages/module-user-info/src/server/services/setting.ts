import { InferApiRequest } from '@roxavn/core/share';
import { GetModuleSettingService } from '@roxavn/module-utils/server';

import { GetSettingsApi } from '../../share';
import { serverModule } from '../module';

@serverModule.useApi(GetSettingsApi)
export class GetSettingsService extends GetModuleSettingService {
  handle(request: InferApiRequest<typeof GetSettingsApi>) {
    return super.handle({ ...request, module: serverModule.name });
  }
}
