import { baseModule } from './module';

export type I18nErrorField = {
  key: string;
  ns?: string;
  params?: Record<string, any>;
};

export interface ErrorResponse {
  /**
   * An error type.
   */
  type: string;

  /**
   * An error i18n.
   */
  i18n: Record<string, I18nErrorField>;
}

export class LogicException extends Error {
  code = 500;
  type: string;
  i18n = {} as ErrorResponse['i18n'];

  constructor(i18n?: ErrorResponse['i18n']) {
    super();
    if (i18n) {
      this.i18n = i18n;
    }
    this.type = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJson(): ErrorResponse {
    return {
      type: this.type,
      i18n: this.i18n,
    };
  }
}

export class BadRequestException extends LogicException {
  code = 400;
  i18n = {
    default: {
      key: 'Error.BadRequestException',
      ns: baseModule.escapedName,
    } as I18nErrorField,
  };
}

export class AlreadyExistsException extends BadRequestException {
  i18n = {
    default: {
      key: 'Error.AlreadyExistsException',
      ns: baseModule.escapedName,
    },
  };
}

export class UnauthorizedException extends LogicException {
  code = 401;
  i18n = {
    default: {
      key: 'Error.UnauthorizedException',
      ns: baseModule.escapedName,
    } as I18nErrorField,
  };
}

export class ForbiddenException extends LogicException {
  code = 403;
  i18n = {
    default: {
      key: 'Error.ForbiddenException',
      ns: baseModule.escapedName,
    } as I18nErrorField,
  };
}

export class NotFoundException extends LogicException {
  code = 404;
  i18n = {
    default: {
      key: 'Error.NotFoundException',
      ns: baseModule.escapedName,
    } as I18nErrorField,
  };
}

export class ValidationException extends LogicException {
  code = 422;
}

export class ServerException extends LogicException {
  code = 500;
  i18n = {
    default: {
      key: 'Error.ServerException',
      ns: baseModule.escapedName,
    } as I18nErrorField,
  };
}
