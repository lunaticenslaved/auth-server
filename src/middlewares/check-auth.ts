import { NextFunction, Request, Response } from 'express';

import { AuthenticationError } from '#/errors';

export async function checkAuth(request: Request, _: Response, next: NextFunction) {
  if (!request.user) {
    throw new AuthenticationError({ errors: ['User not found'], status: 403 });
  }

  next();
}
