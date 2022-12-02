export interface ErrorResponse {
  /**
   * An error type.
   */
  type: string;

  /**
   * An error metadata.
   */
  metadata?: {
    i18n?: string;
    params?: Record<string, any>;
  };
}

export class LogicException extends Error {
  code = 500;
  type: string;
  metadata?: Record<string, unknown>;

  constructor(metadata?: Record<string, unknown>) {
    super();
    this.metadata = metadata;
    this.type = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJson(): ErrorResponse {
    return {
      type: this.type,
      metadata: this.metadata,
    };
  }
}

export class BadRequestException extends LogicException {
  code = 400;
}

export class UnauthorizedException extends LogicException {
  code = 401;
}

export class ForbiddenException extends LogicException {
  code = 403;
}

export class NotFoundException extends LogicException {
  code = 404;
}

export class ValidationException extends LogicException {
  code = 422;
}

export class ServerException extends LogicException {
  code = 500;
}
