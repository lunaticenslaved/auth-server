import { createOperation, getUserFromRequest } from '#/utils';

import { updateAvatar as action } from './action';

export const updateAvatar = createOperation(async (request, _, context) => {
  const { user } = await action(
    {
      userId: getUserFromRequest(request).id,
      avatar: request.body.avatar,
    },
    context,
  );

  return { user };
});
