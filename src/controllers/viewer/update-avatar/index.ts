import { createOperation } from '#/context';
import { RequestUtils } from '#/utils';

import { updateAvatar as action } from './action';
import { UpdateAvatarRequest, UpdateAvatarResponse } from './types';

export const updateAvatar = createOperation<UpdateAvatarResponse, UpdateAvatarRequest>(
  async (request, _, context) => {
    const { user } = await action(
      {
        userId: RequestUtils.getUserId(request, 'strict'),
        avatar: request.body.avatar,
      },
      context,
    );

    return { user };
  },
);
