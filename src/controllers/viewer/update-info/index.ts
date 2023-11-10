import { createOperation, getUserFromRequest } from '#/utils';

import { UpdateInfoRequest, UpdateInfoResponse } from './types';
import { updateInfo as action } from './action';

export const updateInfo = createOperation<UpdateInfoRequest, UpdateInfoResponse>(
  async (request, _, context) => {
    const { user } = await action(
      {
        userId: getUserFromRequest(request).id,
        login: request.body.login,
      },
      context,
    );

    return { user };
  },
);
