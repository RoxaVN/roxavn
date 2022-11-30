import { validateSync } from 'class-validator';
import { Request, Response, Router, NextFunction } from 'express';
import {
  Api,
  ApiRequest,
  ApiResponse,
  baseModule,
  BaseModule,
  FullApiResponse,
} from '../share';
import { ServerException, ValidationException } from './exception';

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
        resp.status(200).json({ code: 200, data: result } as FullApiResponse);
      }
    );
  }

  static fromBase(base: BaseModule) {
    return new ServerModule(base.name);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ServerModule.errorMiddlerwares.push((error, req, resp, next) => {
  if (!error.code) {
    error = new ServerException();
  }
  resp
    .status(error.code)
    .json({ code: error.code, error: error.toJson() } as FullApiResponse);
});

ServerModule.apiMiddlerwares.push((api, req, resp, next) => {
  if (api.validator) {
    const errors = validateSync(new api.validator(getRequestInput(req)), {
      stopAtFirstError: true,
    });
    if (errors.length) {
      const metadata = {};
      errors.forEach((error) => {
        if (error.contexts) {
          metadata[error.property] = Object.values(error.contexts)[0];
        }
      });
      next(new ValidationException(metadata));
      return;
    }
  }
  next();
});

export const serverModule = ServerModule.fromBase(baseModule);
