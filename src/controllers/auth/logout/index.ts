import { createOperation } from '#/context';

import { logout as action } from './action';

export const logout = createOperation(async (request, response, context) => {
  const user = request.user;
  const accessToken = request.cookies['accessToken'] as string;

  if (!user || !accessToken) return;

  await action(
    {
      userId: user.id,
      accessToken,
    },
    context,
  );

  response.cookie('accessToken', '', { expires: new Date() });
});
