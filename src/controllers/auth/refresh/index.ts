import { RefreshResponse } from '@lunaticenslaved/schema/actions';

import { createOperation } from '#/context';
import { RequestUtils, TokensUtils } from '#/utils';

import { refresh as action } from './action';

export const refresh = createOperation<RefreshResponse>(async (req, res, context) => {
  const { refreshToken } = TokensUtils.getTokens(req, 'strict');

  TokensUtils.checkIfTokenIsValid({ refreshToken });

  const { sessionId, userId } = TokensUtils.getTokenData({ refreshToken }, 'strict');

  const { user, ...tokens } = await action(
    {
      sessionId,
      userId,
      userAgent: RequestUtils.getUserAgent(req),
    },
    context,
  );

  TokensUtils.setTokensToResponse(tokens, res);

  return { user, token: tokens.accessToken };
});
