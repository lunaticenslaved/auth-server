import { Context } from '#/context';
import { User } from '#/dto/user';
import { createUserNotFoundError } from '#/services/user';
import { TokensUtils } from '#/utils';

type Request = {
  userId: string;
  sessionId: string;
  userAgent: string;
};

type Response = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export const refresh = async (data: Request, context: Context): Promise<Response> => {
  const { sessionId, userId } = data;

  const sessionFromDb = await context.services.session.get({ sessionId });

  if (!sessionFromDb) {
    throw createUserNotFoundError();
  }

  const user = await context.services.user.get({ userId }, 'strict');

  const tokens = TokensUtils.createTokens({
    userId: user.id,
    sessionId: sessionFromDb.userId,
  });

  return { ...tokens, user };
};
