import bcrypt from 'bcrypt';

import schema from '@lunaticenslaved/schema';

import { Context } from '#/context';
import { User } from '#/models';
import { TokensUtils } from '#/utils';
import { CreateTokensResponse } from '#/utils/tokens';

import { createInvalidPasswordError, createUserWithLoginNotExistsError } from './errors';

type Request = {
  login: string;
  password: string;
  userAgent: string;
  sessionId?: string;
};

type Response = CreateTokensResponse & {
  user: User;
};

export const signIn = async (request: Request, context: Context): Promise<Response> => {
  const { sessionId, userAgent } = request;

  if (sessionId) {
    await context.service.session.delete({ sessionId });
  }

  await schema.Validation.validate(schema.validators.auth.signIn, request);

  const user = await context.service.user.get({ login: request.login }, 'strict');
  const savedPassword = await context.service.user.getPassword({ userId: user.id });

  // TODO move errors to all
  if (!user) {
    throw createUserWithLoginNotExistsError(request.login);
  }

  if (!(await bcrypt.compare(request.password, savedPassword))) {
    throw createInvalidPasswordError();
  }

  const session = await context.service.session.save({ userAgent, userId: user.id });
  const tokens = TokensUtils.createTokens({ userId: user.id, sessionId: session.id });

  return { ...tokens, user };
};
