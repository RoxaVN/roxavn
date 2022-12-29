import { getJsonFromFile, getPackageJson } from './utils';

export interface AppConfigData {
  modules: { [key: string]: any };
}

class AppConfig {
  data: AppConfigData;
  currentModule: string;

  constructor() {
    this.data = getJsonFromFile('.app.config.json');
    this.currentModule = getPackageJson('.').name;
  }
}

export const appConfig = new AppConfig();
