import { Operation, Validation } from '@lunaticenslaved/schema';

import { Context } from '#/context';
import { User } from '#/dto';
import { TokensUtils, createHash } from '#/utils';

import { createUserWithEmailExistsError, createUserWithLoginExistsError } from './errors';

export type Request = {
  login: string;
  email: string;
  password: string;
  userAgent: string;
};

export type Response = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export async function signUp(data: Request, context: Context): Promise<Response> {
  await Validation.validate(Operation.Auth.SignUp.validators, data);

  const userWithLogin = await context.service.user.get({ login: data.login });
  const userWithEmail = await context.service.user.get({ email: data.email });

  if (userWithLogin) {
    throw createUserWithLoginExistsError(data.login);
  }

  if (userWithEmail) {
    throw createUserWithEmailExistsError(data.email);
  }

  const hashedPassword = await createHash(data.password);
  const createdUser = await context.service.user.create({
    login: data.login,
    email: data.email,
    password: hashedPassword,
  });
  const session = await context.service.session.save({
    userAgent: data.userAgent,
    userId: createdUser.id,
  });

  const tokens = TokensUtils.createTokens({
    userId: createdUser.id,
    sessionId: session.id,
  });

  return { ...tokens, user: createdUser };
}
