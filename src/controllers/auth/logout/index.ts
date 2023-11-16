import { createOperation } from '#/context';
import { RequestUtils, TokensUtils } from '#/utils';

import { logout as action } from './action';

export const logout = createOperation(async (request, response, context) => {
  const sessionId = RequestUtils.getSessionId(request);

  if (!sessionId) return;

  await action({ sessionId }, context);

  TokensUtils.removeTokensFormResponse(response);
});
