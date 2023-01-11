import { Api, ApiError, ApiRequest, ApiResponse } from './api';
import { constants } from './constants';

export class BaseModule {
  private readonly _name: string;
  private readonly _escapedName: string;

  constructor(name: string) {
    this._name = name;
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

  /**
   * Make api with full path
   */
  public api<
    Request extends ApiRequest,
    Response extends ApiResponse,
    Error extends ApiError
  >(api: Api<Request, Response, Error>): Api<Request, Response, Error> {
    return {
      ...api,
      path: '/' + constants.API_BASE_PATH + '/' + this._escapedName + api.path,
    };
  }

  public static escapeName(name: string): string {
    return name.replace(/\//g, '@');
  }
}

export const baseModule = new BaseModule('@roxavn/core');
