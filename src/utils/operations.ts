import { Request, Response } from 'express';

import { Context, context } from '#/context';
import { ApiError, UnknownError } from '#/errors';

export type OperationResponse<TData> =
  | {
      result: TData;
      error: null;
    }
  | {
      result: null;
      error: ApiError;
    };

export type CreateOperationArg<TBody = unknown, TResponse = unknown, TParams = unknown> = (
  request: Request<TParams, unknown, TBody>,
  response: Response,
  context: Context,
) => Promise<TResponse> | TResponse;

export const createOperation =
  <TBody = unknown, TResponse = unknown, TParams = unknown>(
    fn: CreateOperationArg<TBody, TResponse, TParams>,
  ) =>
  async (
    request: Request<TParams, unknown, TBody>,
    response: Response<OperationResponse<TResponse | null>>,
  ) => {
    try {
      const result = await fn(request, response, context);

      return response.status(200).json({ result, error: null });
    } catch (err) {
      if (err instanceof ApiError) {
        const error = err as ApiError;

        return response.status(error.status).json({ result: null, error });
      } else {
        const error = err as Error;

        return response.status(500).json({
          result: null,
          error: new UnknownError({ errors: [error.message], status: 500 }),
        });
      }
    }
  };
