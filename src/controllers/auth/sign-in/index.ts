import { SignInRequest, SignInResponse } from '@lunaticenslaved/schema/actions';

import { createOperation } from '#/context';
import { RequestUtils, TokensUtils } from '#/utils';

import { signIn as action } from './action';

export const signIn = createOperation<SignInResponse, SignInRequest>(async (req, res, context) => {
  const { login, password } = req.body;
  const userAgent = RequestUtils.getUserAgent(req);
  const sessionId = RequestUtils.getSessionId(req);

  const { user, ...tokens } = await action(
    {
      login,
      password,
      userAgent,
      sessionId,
    },
    context,
  );

  TokensUtils.setTokensToResponse(tokens, res);

  return {
    user,
    token: tokens.accessToken,
    tokenExpiresAt: new Date(tokens.accessTokenExpiresAt).toISOString(),
  };
});
