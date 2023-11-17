import { NextFunction, Request, Response } from 'express';

import { Errors } from '@lunaticenslaved/schema';

import { RequestUtils } from '#/utils';

export async function checkAuth(request: Request, _: Response, next: NextFunction) {
  const sessionId = RequestUtils.getSessionId(request, 'strict');

  if (!sessionId) {
    throw new Errors.UnauthorizedError({ messages: 'The session is expired', status: 403 });
  }

  next();
}
