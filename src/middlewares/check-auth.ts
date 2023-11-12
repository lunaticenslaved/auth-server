import { NextFunction, Request, Response } from 'express';

import { Error } from '@lunaticenslaved/schema';

export async function checkAuth(request: Request, _: Response, next: NextFunction) {
  if (!request.user) {
    throw new Error.AuthenticationError({
      messages: ['User not found'],
      status: 403,
    });
  }

  next();
}
