import { createOperation } from '#/context';
import { tokens } from '#/utils';

export const logout = createOperation(async (request, response, context) => {
  const refreshToken = tokens.refresh.get(request);

  if (!refreshToken) return;

  const session = await context.service.session.get({ refreshToken });

  tokens.removeTokensFormResponse(response);

  if (!session) return;

  await context.service.session.delete({ sessionId: session.id });

  tokens.removeTokensFormResponse(response);

  return;
});
