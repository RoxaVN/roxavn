import { validateSync } from 'class-validator';
import { Request, Response, Router, NextFunction } from 'express';
import { Api, ApiRequest, ApiResponse, baseModule, BaseModule } from '../share';
import {
  BadRequestException,
  LogicException,
  ServerException,
} from './exception';

export type ApiMiddlerware = (
  api: Api,
  req: Request,
  resp: Response,
  next: NextFunction
) => void;

export type ErrorMiddlerware = (
  error: any,
  req: Request,
  resp: Response,
  next: NextFunction
) => void;

const getRequestInput = (req: Request) =>
  Object.assign({}, req.query || {}, req.body || {}, req.params || {});

export class ServerModule extends BaseModule {
  static apiRouter = Router();
  static apiMiddlerwares = [] as Array<ApiMiddlerware>;
  static errorMiddlerwares = [] as Array<ErrorMiddlerware>;

  useApi<Req extends ApiRequest, Resp extends ApiResponse>(
    api: Api<Req, Resp>,
    handler: (req: Req, context: { req: Request; resp: Response }) => Resp
  ) {
    ServerModule.apiRouter[api.method.toLowerCase()](
      BaseModule.genFullApiPath(api.path, this.name),
      ...ServerModule.apiMiddlerwares.map(
        (middleware) =>
          function (req: Request, resp: Response, next: NextFunction) {
            middleware(api, req, resp, next);
          }
      ),
      function (req: Request, resp: Response) {
        const result = handler(getRequestInput(req), { req, resp });
        resp.json(result);
      }
    );
  }

  static fromBase(base: BaseModule) {
    return new ServerModule(base.name);
  }

  static createApiMiddleware(apiMiddlerware: ApiMiddlerware) {
    ServerModule.apiMiddlerwares.push(apiMiddlerware);
  }

  static createErrorMiddleware(errorMiddlerware: ErrorMiddlerware) {
    ServerModule.errorMiddlerwares.push(errorMiddlerware);
  }
}

ServerModule.createErrorMiddleware((error, req, resp) => {
  if (!(error instanceof LogicException)) {
    error = new ServerException();
  }
  resp.status(error.code).json(error.toJson());
});

ServerModule.createApiMiddleware((api, req, resp, next) => {
  if (api.validator) {
    const errors = validateSync(new api.validator(getRequestInput(req)));
    if (errors.length) {
      const exception = new BadRequestException();
      exception.metadata = { errors };
      next(exception);
      return;
    }
  }
  next();
});

export const serverModule = ServerModule.fromBase(baseModule);
