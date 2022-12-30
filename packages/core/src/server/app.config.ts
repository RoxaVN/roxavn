import fs from 'fs';

import { getJsonFromFile, getPackageJson } from './utils';

export interface AppConfigData {
  modules: { [key: string]: any };
}

class AppConfig {
  private _data?: AppConfigData;
  private _currentModule?: string;

  get data(): AppConfigData {
    if (this._data) {
      return this._data;
    }
    if (fs.existsSync('.app.config.json')) {
      this._data = getJsonFromFile('.app.config.json');
      return this._data as AppConfigData;
    } else {
      return { modules: {} };
    }
  }

  get currentModule(): string {
    if (this._currentModule) {
      return this._currentModule;
    }
    this._currentModule = getPackageJson('.').name;
    return this._currentModule as string;
  }
}

export const appConfig = new AppConfig();
