import { plainToInstance } from 'class-transformer';
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

  useRawApi<Req extends ApiRequest, Resp extends ApiResponse>(
    api: Api<Req, Resp>,
    handler: (req: Req, context: MiddlerwareContext) => Promise<Resp> | Resp
  ) {
    ServerModule.apiRouter[api.method.toLowerCase()](
      this.getFullApiPath(api),
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
          const result = await handler(resp.locals as Req, {
            req,
            resp,
            dataSource: databaseManager.dataSource,
          });
          resp.status(200).json({ code: 200, data: result } as FullApiResponse);
        } catch (e) {
          next(e);
        }
      }
    );
  }

  useApi<Req extends ApiRequest, Resp extends ApiResponse>(
    api: Api<Req, Resp>
  ) {
    return (
      serviceClass: new (...args: any[]) => ApiService<Api<Req, Resp>>
    ) => {
      this.useRawApi(api, async (req, { dataSource }) => {
        const service = new serviceClass(dataSource);
        return service.handle(req);
      });
    };
  }

  static fromBase(base: BaseModule) {
    return new ServerModule(base.name);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ServerModule.errorMiddlerwares.push((error, context, next) => {
  if (!error.code || !error.toJson) {
    error = new ServerException();
  }
  context.resp
    .status(error.code)
    .json({ code: error.code, error: error.toJson() } as FullApiResponse);
});

ServerModule.apiMiddlerwares.push((api, { req, resp }, next) => {
  if (api.validator) {
    const rawData = Object.assign(
      {},
      req.params || {},
      api.method === 'GET' ? req.query : req.body
    );
    const parsedData = plainToInstance(api.validator, rawData);

    const errors = validateSync(parsedData, {
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

    Object.assign(resp.locals, parsedData);
  }
  next();
});

export const serverModule = ServerModule.fromBase(baseModule);
