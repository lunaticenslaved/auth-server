import { createOperation } from '#/context';
import { TokensUtils } from '#/utils';

export const logout = createOperation(async (request, response, context) => {
  const refreshToken = TokensUtils.getRefreshToken(request);

  if (!refreshToken) return;

  const session = await context.service.session.get({ refreshToken });

  if (!session) return;

  await context.service.session.delete({ sessionId: session.id });

  TokensUtils.removeTokensFormResponse(response);
});
