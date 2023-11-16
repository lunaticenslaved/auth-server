import Schema from '@lunaticenslaved/schema';

import { Context } from '#/context';
import { User } from '#/dto';
import { TokensUtils, createHash } from '#/utils';

import { createUserWithLoginExistsError } from './errors';

const validators = {
  login: Schema.Validators.login,
  password: Schema.Validators.newPassword,
};

export type Request = {
  login: string;
  password: string;
  userAgent: string;
};

export type Response = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export async function signUp(data: Request, context: Context): Promise<Response> {
  await Schema.Validation.validateRequest(validators, data);

  const user = await context.prisma.user.findFirst({
    where: { login: { equals: data.login } },
  });

  if (user) {
    throw createUserWithLoginExistsError(data.login);
  }

  const hashedPassword = await createHash(data.password);
  const createdUser = await context.services.user.create({
    login: data.login,
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
