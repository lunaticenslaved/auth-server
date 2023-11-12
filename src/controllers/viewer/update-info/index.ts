import { createOperation, getUserFromRequest } from '#/utils';

import { updateInfo as action } from './action';

export const updateInfo = createOperation(async (request, _, context) => {
  const { user } = await action(
    {
      userId: getUserFromRequest(request).id,
      login: request.body.login,
    },
    context,
  );

  return { user };
});
