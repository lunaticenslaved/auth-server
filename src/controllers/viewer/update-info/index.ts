import { createOperation } from '#/context';
import { User } from '#/models';
import { RequestUtils } from '#/utils';

import { updateInfo as action } from './action';

export type UpdateInfoRequest = {
  login: string;
};

export type UpdateInfoResponse = {
  user: User;
};

export const updateInfo = createOperation(async (request, _, context) => {
  const { user } = await action(
    {
      userId: RequestUtils.getUserId(request, 'strict'),
      login: request.body.login,
    },
    context,
  );

  return { user };
});
