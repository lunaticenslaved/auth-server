import { ApiError, ApiErrorType } from './base-error';

export * from './base-error';

export class ValidationError extends ApiError {
  public type = ApiErrorType.ValidationError;
}

export class UnknownError extends ApiError {
  public type = ApiErrorType.UnknownError;
}

export class AuthenticationError extends ApiError {
  public type = ApiErrorType.AuthenticationError;
}

export class ConflictError extends ApiError {
  public type = ApiErrorType.ConflictError;
}

export class NotFoundError extends ApiError {
  public type = ApiErrorType.NotFoundError;
}

export class FileNotProvidedError extends ApiError {
  public type = ApiErrorType.FileNotProvidedError;
}

export class UnauthorizedError extends ApiError {
  public type = ApiErrorType.UnauthorizedError;
}
