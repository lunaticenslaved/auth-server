import bcrypt from 'bcrypt';

import { Operation, Validation } from '@lunaticenslaved/schema';

import { Context } from '#/context';
import { User } from '#/dto';
import { TokensUtils } from '#/utils';

import { createInvalidPasswordError, createUserWithLoginNotExistsError } from './errors';

type Request = {
  login: string;
  password: string;
  userAgent: string;
  sessionId?: string;
};

type Response = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export const signIn = async (request: Request, context: Context): Promise<Response> => {
  const { sessionId, userAgent } = request;

  if (sessionId) {
    await context.services.session.delete({ sessionId });
  }

  await Validation.validateRequest(Operation.Auth.SignIn.validators, request);

  const user = await context.services.user.get({ login: request.login }, 'strict');
  const savedPassword = await context.services.user.getPassword({ userId: user.id });

  // TODO move errors to all
  if (!user) {
    throw createUserWithLoginNotExistsError(request.login);
  }

  if (!(await bcrypt.compare(request.password, savedPassword))) {
    throw createInvalidPasswordError();
  }

  const session = await context.services.session.save({ userAgent, userId: user.id });
  const tokens = TokensUtils.createTokens({ userId: user.id, sessionId: session.id });

  return { ...tokens, user };
};
