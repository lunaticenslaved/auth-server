import { NextFunction, Request, Response } from 'express';

import { logger } from '#/utils';

export async function logRequest(request: Request, _: Response, next: NextFunction) {
  logger.info(
    `[MIDDLEWARE] Log request:\n  - headers: ${JSON.stringify(request.headers, null, 2)}`,
  );

  next();
}
