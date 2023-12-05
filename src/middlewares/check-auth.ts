import { NextFunction, Request, Response } from 'express';

import { RequestUtils, logger } from '#/utils';

export async function checkAuth(request: Request, _: Response, next: NextFunction) {
  logger.info('[MIDDLEWARE] Check auth');

  RequestUtils.getUserId(request, 'strict');

  next();
}
