import { SignUpRequest, SignUpResponse } from '@lunaticenslaved/schema/actions';

import { createOperation } from '#/context';
import { RequestUtils, TokensUtils } from '#/utils';

import { signUp as action } from './action';

export const signUp = createOperation<SignUpResponse, SignUpRequest>(async (req, res, context) => {
  const { body } = req;
  const userAgent = RequestUtils.getUserAgent(req);

  const { user, ...tokens } = await action({ ...body, userAgent }, context);

  TokensUtils.setTokensToResponse(tokens, res);

  return {
    user,
    token: tokens.accessToken,
    expiresAt: tokens.accessTokenExpiresAt,
  };
});
