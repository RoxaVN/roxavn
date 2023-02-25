import { WebModule } from '@roxavn/core/web';
import { settingApi } from '../base';
import { ModuleSettings } from './components';

WebModule.settingsPageRender = (module) => {
  return (
    <ModuleSettings
      api={settingApi.getAll}
      apiParams={{ module: module.name }}
      forms={module.adminSettings}
    />
  );
};
