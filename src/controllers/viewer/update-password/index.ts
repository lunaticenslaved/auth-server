import { createOperation } from '#/context';
import { getUserFromRequest } from '#/utils';

import { updatePassword as action } from './action';

export const updatePassword = createOperation(async (request, _, context) => {
  const user = getUserFromRequest(request);

  const response = await action({ userId: user.id, ...request.body }, context);

  return response;
});
