import { Schema } from '@lunaticenslaved/schema';

import { Context } from '#/context';
import { UserDTO } from '#/dto';
import { createHash, createTokens } from '#/utils';

import { createUserWithLoginExistsError } from './errors';
import { SignUpRequest, SignUpResponse } from './types';

const validators = {
  login: Schema.Validators.login,
  password: Schema.Validators.newPassword,
};

export type Request = SignUpRequest & {
  userAgent: string;
};

export type Response = SignUpResponse & {
  accessToken: string;
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
  const createdUser = await context.prisma.user.create({
    data: {
      login: data.login,
      password: hashedPassword,
    },
    select: UserDTO.selector,
  });

  const { refreshToken, accessToken } = createTokens();
  await context.prisma.session.create({
    data: {
      user: { connect: { id: createdUser.id } },
      userAgent: data.userAgent,
      refreshToken,
      accessToken,
    },
  });

  return {
    accessToken,
    user: UserDTO.prepare(createdUser),
  };
}
