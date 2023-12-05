import { SignInRequest, SignInResponse } from '@lunaticenslaved/schema/actions';

import { createOperation } from '#/context';
import { RequestUtils, tokens } from '#/utils';

import { signIn as action } from './action';

export const signIn = createOperation<SignInResponse, SignInRequest>(async (req, res, context) => {
  const { login, password, fingerprint } = req.body;
  const userAgent = RequestUtils.getUserAgent(req);
  const ip = RequestUtils.getIP(req);

  const { user, refreshToken, accessToken } = await action(
    {
      login,
      password,
      userAgent,
      fingerprint,
      ip,
    },
    context,
  );

  tokens.setTokensToResponse(refreshToken, res);

  return {
    user,
    token: accessToken.token,
    expiresAt: accessToken.expiresAt.toISOString(),
  };
});
