import { NextFunction, Request, Response } from 'express';

import { RequestUtils } from '#/utils';

export async function checkAuth(request: Request, _: Response, next: NextFunction) {
  RequestUtils.getUserId(request, 'strict');

  next();
}
