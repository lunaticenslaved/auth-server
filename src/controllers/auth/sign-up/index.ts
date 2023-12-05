import { SignUpRequest, SignUpResponse } from '@lunaticenslaved/schema/actions';

import { createOperation } from '#/context';
import { RequestUtils, tokens } from '#/utils';

import { signUp as action } from './action';

export const signUp = createOperation<SignUpResponse, SignUpRequest>(async (req, res, context) => {
  const { body } = req;
  const userAgent = RequestUtils.getUserAgent(req);
  const ip = RequestUtils.getIP(req);

  const { user, accessToken, refreshToken } = await action({ ...body, userAgent, ip }, context);

  tokens.setTokensToResponse(refreshToken, res);

  return {
    user,
    token: accessToken.token,
    expiresAt: accessToken.expiresAt.toISOString(),
  };
});
