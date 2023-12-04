import { NextFunction, Request, Response } from 'express';

import { RequestUtils, logger } from '#/utils';

export async function logRequest(request: Request, _: Response, next: NextFunction) {
  const userId = RequestUtils.getUserId(request);

  logger.info(
    `[MIDDLEWARE] Log request:
        - method: ${request.method}
        - userId: ${userId || '-'}
        - url: ${request.originalUrl}
        - headers: ${JSON.stringify(request.headers, null, 2)}`,
  );

  next();
}
