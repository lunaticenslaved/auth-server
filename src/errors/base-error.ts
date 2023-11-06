export enum ApiErrorType {
  ValidationError = 'ValidationError',
  UnknownError = 'UnknownError',
  AuthenticationError = 'AuthenticationError',
  UnauthorizedError = 'UnautorizedError',
  ConflictError = 'ConflictError',
  NotFoundError = 'NotFoundError',
  FileNotProvidedError = 'FileNotProvidedError',
}

type ApiErrorProps = {
  errors: string[];
  status?: number;
};

export abstract class ApiError extends Error {
  public abstract type: ApiErrorType;
  public errors: string[] = [];
  public status: number = 500;

  constructor({ errors, status = 500 }: ApiErrorProps) {
    super();

    this.errors = errors;
    this.status = status;
  }
}
