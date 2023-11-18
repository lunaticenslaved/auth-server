import { Operation, Validation } from '@lunaticenslaved/schema';

import { Context } from '#/context';
import { User } from '#/dto';
import { TokensUtils, createHash } from '#/utils';

import { createUserWithLoginExistsError } from './errors';

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
  await Validation.validateRequest(Operation.Auth.SignUp.validators, data);

  const user = await context.prisma.user.findFirst({
    where: { login: { equals: data.login } },
  });

  if (user) {
    throw createUserWithLoginExistsError(data.login);
  }

  const hashedPassword = await createHash(data.password);
  const createdUser = await context.services.user.create({
    login: data.login,
    email: data.email,
    password: hashedPassword,
  });
  const session = await context.services.session.save({
    userAgent: data.userAgent,
    userId: createdUser.id,
  });

  const tokens = TokensUtils.createTokens({
    userId: createdUser.id,
    sessionId: session.id,
  });

  return { ...tokens, user: createdUser };
}
