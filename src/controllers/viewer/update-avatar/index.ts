import { createOperation } from '#/context';
import { RequestUtils } from '#/utils';

import { updateAvatar as action } from './action';

export const updateAvatar = createOperation(async (request, _, context) => {
  const { user } = await action(
    {
      userId: RequestUtils.getUserId(request, 'strict'),
      avatar: request.body.avatar,
    },
    context,
  );

  return { user };
});
