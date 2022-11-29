export class LogicException extends Error {
  code: number;
  type: string;
  metadata?: Record<string, unknown>;

  constructor(code: number) {
    super();
    this.code = code;
    this.type = this.constructor.name;
  }

  toJson() {
    return {
      code: this.code,
      type: this.type,
      metadata: this.metadata,
    };
  }
}

export class BadRequestException extends LogicException {
  constructor() {
    super(400);
  }
}

export class UnauthorizedException extends LogicException {
  constructor() {
    super(401);
  }
}

export class ForbiddenException extends LogicException {
  constructor() {
    super(403);
  }
}

export class NotFoundException extends LogicException {
  constructor() {
    super(404);
  }
}

export class ServerException extends LogicException {
  constructor() {
    super(500);
  }
}
