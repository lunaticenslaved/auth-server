import { createOperation } from '#/context';
import { RequestUtils, TokensUtils } from '#/utils';

import { signUp as action } from './action';

export const signUp = createOperation(async (req, res, context) => {
  const { body } = req;
  const userAgent = RequestUtils.getUserAgent(req);

  const { user, ...tokens } = await action({ ...body, userAgent }, context);

  TokensUtils.setTokensToResponse(tokens, res);

  return { user, accessToken: tokens.accessToken };
});
