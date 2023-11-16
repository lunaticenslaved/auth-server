import { createOperation } from '#/context';
import { RequestUtils } from '#/utils';

import { updatePassword as action } from './action';

export const updatePassword = createOperation(async (request, _, context) => {
  const oldPassword = request.body.oldPassword as string;
  const newPassword = request.body.newPassword as string;

  const response = await action(
    {
      userId: RequestUtils.getUserId(request, 'strict'),
      oldPassword,
      newPassword,
    },
    context,
  );

  return response;
});
