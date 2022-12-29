import fs from 'fs';

import { getJsonFromFile, getPackageJson } from './utils';

export interface AppConfigData {
  modules: { [key: string]: any };
}

class AppConfig {
  data: AppConfigData;
  currentModule: string;

  constructor() {
    if (fs.existsSync('.app.config.json')) {
      this.data = getJsonFromFile('.app.config.json');
    } else {
      this.data = { modules: {} };
    }
    this.currentModule = getPackageJson('.').name;
  }
}

export const appConfig = new AppConfig();
