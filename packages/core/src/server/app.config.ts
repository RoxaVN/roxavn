import { getJsonFromFile } from './utils';

export interface AppConfigData {
  modules: { [key: string]: any };
}

class AppConfig {
  data?: AppConfigData;

  get(): AppConfigData {
    if (!this.data) {
      this.data = getJsonFromFile('.app.config.json') as AppConfigData;
    }
    return this.data;
  }
}

export const appConfig = new AppConfig();
