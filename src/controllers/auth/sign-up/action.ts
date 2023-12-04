import schema from '@lunaticenslaved/schema';

import { Context } from '#/context';
import { User } from '#/models';
import { TokensUtils, createHash } from '#/utils';
import { CreateAccessTokenResponse, CreateRefreshTokenResponse } from '#/utils/tokens';

import { createUserWithEmailExistsError, createUserWithLoginExistsError } from './errors';

export type Request = {
  login: string;
  email: string;
  password: string;
  userAgent: string;
  fingerprint: string;
  ip: string;
};

export type Response = {
  user: User;
  accessToken: CreateAccessTokenResponse;
  refreshToken: CreateRefreshTokenResponse;
};

export async function signUp(data: Request, context: Context): Promise<Response> {
  // validate input
  await schema.Validation.validate(schema.validators.auth.signIn, data);

  // check if login and email unique
  const userWithLogin = await context.service.user.get({ login: data.login });
  const userWithEmail = await context.service.user.get({ email: data.email });

  if (userWithLogin) {
    throw createUserWithLoginExistsError(data.login);
  }

  if (userWithEmail) {
    throw createUserWithEmailExistsError(data.email);
  }

  // create user
  const hashedPassword = await createHash(data.password);
  const createdUser = await context.service.user.create({
    login: data.login,
    email: data.email,
    password: hashedPassword,
  });

  // save session
  const refreshToken = TokensUtils.createRefreshToken({ userId: createdUser.id });
  const session = await context.service.session.save({
    userAgent: data.userAgent,
    userId: createdUser.id,
    fingerprint: data.fingerprint,
    ip: data.ip,
    refreshToken: refreshToken.token,
    expiresAt: refreshToken.expiresAt,
  });

  context.service.mail.sendUserActivationMail({
    email: createdUser.email,
    userId: createdUser.id,
  });

  // create access token
  const accessToken = TokensUtils.createAccessToken({
    userId: createdUser.id,
    sessionId: session.id,
  });

  return { refreshToken, accessToken, user: createdUser };
}
