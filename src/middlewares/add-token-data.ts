import { NextFunction, Request, Response } from 'express';

import { RequestUtils } from '#/utils';

// TODO: maybe there is no need in this middleware. I have cool functions from request utils
export async function addTokenData(request: Request, _: Response, next: NextFunction) {
  request.userId = RequestUtils.getUserId(request);
  request.sessionId = RequestUtils.getSessionId(request);

  next();
}
