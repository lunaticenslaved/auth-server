import { Context } from '#/context';
import { Validators, createHash, createTokens, validateRequest } from '#/utils';
import { UserDTO } from '#/dto';

import { SignUpRequest, SignUpResponse } from './types';
import { createUserWithLoginExistsError } from './errors';

const validators = {
  login: Validators.login,
  password: Validators.newPassword,
};

export type Request = SignUpRequest & {
  userAgent: string;
};

export type Response = SignUpResponse & {
  accessToken: string;
};

export async function signUp(data: Request, context: Context): Promise<Response> {
  await validateRequest(validators, data);

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
