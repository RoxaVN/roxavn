export interface ErrorResponse {
  /**
   * An error type.
   */
  type: string;

  /**
   * An error message.
   */
  message?: string;

  /**
   * An error metadata.
   */
  metadata?: Record<string, unknown>;
}

export interface BadRequestException extends ErrorResponse {
  type: 'BadRequestException';
}

export interface UnauthorizedException extends ErrorResponse {
  type: 'UnauthorizedException';
}

export interface ForbiddenException extends ErrorResponse {
  type: 'ForbiddenException';
}

export interface NotFoundException extends ErrorResponse {
  type: 'NotFoundException';
}
