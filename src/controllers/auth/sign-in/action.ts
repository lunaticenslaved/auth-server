import bcrypt from 'bcrypt';

import { Schema } from '@lunaticenslaved/schema';

import { Context } from '#/context';
import { UserDTO } from '#/dto';
import { createTokens } from '#/utils';

import { createInvalidPasswordError, createUserWithLoginNotExistsError } from './errors';
import { SignInRequest, SignInResponse } from './types';

type Request = SignInRequest & {
  userAgent: string;
};

type Response = SignInResponse & {
  accessToken: string;
};

const validators = {
  login: Schema.Validators.login,
  password: Schema.Validators.required('Password is required'),
};

export const signIn = async (request: Request, context: Context): Promise<Response> => {
  await Schema.Validation.validateRequest(validators, request);

  const user = await context.prisma.user.findFirst({
    where: { login: { equals: request.login } },
    select: { ...UserDTO.selector, password: true },
  });

  if (!user) {
    throw createUserWithLoginNotExistsError(request.login);
  }

  const { password: savedPassword, ...savedUser } = user;

  if (!(await bcrypt.compare(request.password, savedPassword))) {
    throw createInvalidPasswordError();
  }

  const { refreshToken, accessToken } = createTokens();

  // find a session for user and agent
  const session = await context.prisma.session.findFirst({
    where: {
      userAgent: { equals: request.userAgent },
      userId: { equals: user.id },
    },
  });

  if (session) {
    // update session with new tokens
    await context.prisma.session.update({
      where: { id: session.id },
      data: {
        accessToken: { set: accessToken },
        refreshToken: { set: refreshToken },
      },
    });
  } else {
    // save new session
    await context.prisma.session.create({
      data: {
        user: { connect: { id: user.id } },
        userAgent: request.userAgent,
        accessToken,
        refreshToken,
      },
    });
  }

  return {
    accessToken,
    user: UserDTO.prepare(savedUser),
  };
};
