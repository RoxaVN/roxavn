import { WebModule } from '@roxavn/core/web';
import { settingApi } from '../base/index.js';
import { ModuleSettings } from './components/index.js';

WebModule.settingsPageRender = (module) => {
  return (
    <ModuleSettings
      api={settingApi.getAll}
      apiParams={{ module: module.name }}
      forms={module.adminSettings}
    />
  );
};
