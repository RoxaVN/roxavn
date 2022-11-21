import { Api, ApiError, ApiRequest, ApiResponse } from './api';
import { API_BASE_PATH, INTERNAL_WEB_BASE_PATH } from './constants';
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
    isInternal: boolean,
    params?: Record<string, any>
  ): Api<Request, Response, Error> {
    return {
      ...api,
      path:
        '/' +
        API_BASE_PATH +
        (isInternal ? '/internal/' : '/external/') +
        this._escapedName +
        (params ? urlUtils.gen(api.path, params) : api.path),
    };
  }

  public static escapeName(name: string): string {
    return name.replace(/\//g, '@');
  }

  /**
   * Generate full web path
   * @param router: router has path which must start with a slash
   * @returns: web path string
   */
  public genWebPath(router: WebRoute): string {
    if (router.isInternal) {
      return INTERNAL_WEB_BASE_PATH + router.path;
    }
    const basePath = BaseModule.getBasePath(this.name);
    return (basePath ? '/' + basePath : '') + router.path;
  }

  static getBasePath(moduleName: string): string {
    throw Error(`getBasePath('${moduleName}') not implement`);
  }
}
