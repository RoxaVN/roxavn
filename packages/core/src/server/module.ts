import { validateSync } from 'class-validator';
import { Request, Response, Router, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import {
  Api,
  ApiRequest,
  ApiResponse,
  baseModule,
  BaseModule,
  ErrorResponse,
  FullApiResponse,
  ServerException,
  ValidationException,
} from '../share';
import { databaseManager } from './database';
import { ApiService } from './service';

export type MiddlerwareContext = {
  req: Request;
  resp: Response;
  dataSource: DataSource;
};

export type ApiMiddlerware = (
  api: Api,
  context: MiddlerwareContext,
  next: NextFunction
) => Promise<void> | void;

export type ErrorMiddlerware = (
  error: any,
  context: MiddlerwareContext,
  next: NextFunction
) => Promise<void> | void;

export class ServerModule extends BaseModule {
  static apiRouter = Router();
  static apiMiddlerwares = [] as Array<ApiMiddlerware>;
  static errorMiddlerwares = [] as Array<ErrorMiddlerware>;

  useApi<Req extends ApiRequest, Resp extends ApiResponse>(
    api: Api<Req, Resp>,
    handler: (
      req: Req,
      context: { req: Request; resp: Response }
    ) => Promise<Resp> | Resp
  ) {
    ServerModule.apiRouter[api.method.toLowerCase()](
      BaseModule.genFullApiPath(api.path, this.name),
      ...ServerModule.apiMiddlerwares.map(
        (middleware) =>
          function (req: Request, resp: Response, next: NextFunction) {
            middleware(
              api,
              { req, resp, dataSource: databaseManager.dataSource },
              next
            )?.catch(next);
          }
      ),
      async function (req: Request, resp: Response, next: NextFunction) {
        try {
          const inputData = Object.assign(
            {},
            req.query,
            req.body,
            req.params,
            resp.locals
          );
          const result = await handler(inputData, { req, resp });
          resp.status(200).json({ code: 200, data: result } as FullApiResponse);
        } catch (e) {
          next(e);
        }
      }
    );
  }

  static fromBase(base: BaseModule) {
    return new ServerModule(base.name);
  }
}

export function useApi<Req extends ApiRequest, Resp extends ApiResponse>(
  module: ServerModule,
  api: Api<Req, Resp>
) {
  return function (
    serviceClass: new (...args: any[]) => ApiService<Api<Req, Resp>>
  ) {
    module.useApi(api, async (req) => {
      const service = new serviceClass(databaseManager.dataSource);
      return service.handle(req);
    });
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ServerModule.errorMiddlerwares.push((error, context, next) => {
  if (!error.code) {
    error = new ServerException();
  }
  context.resp
    .status(error.code)
    .json({ code: error.code, error: error.toJson() } as FullApiResponse);
});

ServerModule.apiMiddlerwares.push((api, { req }, next) => {
  if (api.validator) {
    const inputData = Object.assign(
      {},
      req.params || {},
      api.method === 'GET' ? req.query : req.body
    );
    const errors = validateSync(new api.validator(inputData), {
      stopAtFirstError: true,
    });
    if (errors.length) {
      const i18n: ErrorResponse['i18n'] = {};
      errors.forEach((error) => {
        if (error.contexts) {
          i18n[error.property] = Object.values(error.contexts)[0];
        }
      });
      return next(new ValidationException(i18n));
    }
  }
  next();
});

export const serverModule = ServerModule.fromBase(baseModule);
