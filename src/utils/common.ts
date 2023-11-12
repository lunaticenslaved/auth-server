import { Express, Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Error } from '@lunaticenslaved/schema';

import { Constants } from '#/utils';

export const createRoutes = (fn: (app: Express) => void) => (app: Express) => {
  fn(app);
};

export const createHash = async (str: string) => {
  return bcrypt.hash(str, 10);
};

export const createTokens = (data?: string | object | Buffer) => {
  const accessToken = jwt.sign(data || {}, Constants.ACCESS_TOKEN_SECRET, {
    expiresIn: Constants.ACCESS_TOKEN_EXPIRES_IN,
  });
  const refreshToken = jwt.sign(data || {}, Constants.REFRESH_TOKEN_SECRET, {
    expiresIn: Constants.REFRESH_TOKEN_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

export const getUserFromRequest = (request: Request<unknown, unknown, unknown, unknown>) => {
  const user = request.user;

  if (!user) {
    throw new Error.UnauthorizedError({ messages: 'User not found', status: 403 });
  }

  return user;
};
