import { Operation } from '@lunaticenslaved/schema';

import { createOperation } from '#/context';
import { RequestUtils, TokensUtils } from '#/utils';

import { refresh as action } from './action';

type Response = Operation.Auth.RefreshResponse;

export const refresh = createOperation<Response>(async (req, res, context) => {
  const { refreshToken } = TokensUtils.getTokens(req, 'strict');

  TokensUtils.checkIfTokenExpired({ refreshToken });

  const { user, ...tokens } = await action(
    {
      sessionId: RequestUtils.getSessionId(req, 'strict'),
      userId: RequestUtils.getUserId(req, 'strict'),
      userAgent: RequestUtils.getUserAgent(req),
    },
    context,
  );

  TokensUtils.setTokensToResponse(tokens, res);

  return { user, token: tokens.accessToken };
});
