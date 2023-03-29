import { constants } from './constants';

interface ModuleOptions {
  appPath?: string;
}

export class BaseModule {
  private readonly _name: string;
  private readonly _escapedName: string;
  public readonly options?: ModuleOptions;

  constructor(name: string, options?: ModuleOptions) {
    this._name = name;
    this.options = options;
    this._escapedName = BaseModule.escapeName(name);
  }

  public get name(): string {
    return this._name;
  }

  /**
   * Escapes some characters in module name. In some situations,
   * file or url is named by module (ex i18n) but module name
   * can contain reserved characters (ex /).
   */
  public get escapedName(): string {
    return this._escapedName;
  }

  apiPath(path: string) {
    return '/' + constants.API_BASE_PATH + '/' + this._escapedName + path;
  }

  public static escapeName(name: string): string {
    return name.replace(/\//g, '@');
  }
}

export const baseModule = new BaseModule('@roxavn/core');
