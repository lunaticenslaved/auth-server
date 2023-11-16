import { createOperation } from '#/context';
import { RequestUtils, TokensUtils } from '#/utils';

import { signIn as action } from './action';

export const signIn = createOperation(async (req, res, context) => {
  const login = req.body.login as string;
  const password = req.body.password as string;
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

  return { user };
});
