import { Api, ApiError, ApiRequest, ApiResponse } from './api';
import { API_BASE_PATH } from './constants';
import { WebRoute } from './route';
import { urlUtils } from './url';

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
  >(
    api: Api<Request, Response, Error>,
    params?: Record<string, any>
  ): Api<Request, Response, Error> {
    return {
      ...api,
      path:
        '/' +
        API_BASE_PATH +
        '/' +
        this._escapedName +
        (params ? urlUtils.gen(api.path, params) : api.path),
    };
  }

  public static escapeName(name: string): string {
    return name.replace(/\//g, '@');
  }

  public static genFullApiPath(path: string, name: string): string {
    return '/' + API_BASE_PATH + '/' + BaseModule.escapeName(name) + path;
  }

  public genWebPath(router: WebRoute, params?: Record<string, any>) {
    const { path } = router;
    return params ? urlUtils.gen(path, params) : path;
  }
}

export const baseModule = new BaseModule('@roxavn/core');
