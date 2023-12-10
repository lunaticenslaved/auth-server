import schema from '@lunaticenslaved/schema';

import { Context } from '#/context';
import { User } from '#/models';
import { createHash, tokens } from '#/utils';
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

  // create access token
  const accessToken = tokens.access.create({ userId: createdUser.id });

  // save session
  const refreshToken = tokens.refresh.create({ userId: createdUser.id });
  await context.service.session.save({
    userAgent: data.userAgent,
    userId: createdUser.id,
    fingerprint: data.fingerprint,
    ip: data.ip,
    refreshToken: refreshToken.token,
    expiresAt: refreshToken.expiresAt,
    accessToken: accessToken.token,
  });

  context.service.mail.sendUserActivationMail({
    email: createdUser.email,
    userId: createdUser.id,
  });

  return { refreshToken, accessToken, user: createdUser };
}
