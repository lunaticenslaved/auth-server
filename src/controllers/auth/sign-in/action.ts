import bcrypt from 'bcryptjs';

import schema from '@lunaticenslaved/schema';

import { Context } from '#/context';
import { User } from '#/models';
import { tokens } from '#/utils';
import { CreateAccessTokenResponse, CreateRefreshTokenResponse } from '#/utils/tokens';

import { createInvalidPasswordError } from './errors';

type Request = {
  login: string;
  password: string;
  userAgent: string;
  fingerprint: string;
  ip: string;
};

type Response = {
  user: User;
  accessToken: CreateAccessTokenResponse;
  refreshToken: CreateRefreshTokenResponse;
};

export const signIn = async (request: Request, context: Context): Promise<Response> => {
  const { login, password, ...restData } = request;

  // validate input
  await schema.Validation.validate(schema.validators.auth.signIn, request);

  // check login and password
  const user = await context.service.user.get({ login }, 'strict');
  const savedPassword = await context.service.user.getPassword({ userId: user.id });
  if (!(await bcrypt.compare(password, savedPassword))) {
    throw createInvalidPasswordError();
  }

  // remove session with the same fingerprint
  const currentSession = await context.service.session.get({
    userId: user.id,
    fingerprint: request.fingerprint,
  });

  if (currentSession) {
    await context.service.session.delete({ sessionId: currentSession.id });
  }

  // create access token
  const accessToken = tokens.access.create({ userId: user.id });

  // save session
  const refreshToken = tokens.refresh.create({ userId: user.id });

  await context.service.session.save({
    ...restData,
    userId: user.id,
    refreshToken: refreshToken.token,
    expiresAt: refreshToken.expiresAt,
    accessToken: accessToken.token,
  });

  return { refreshToken, accessToken, user };
};
