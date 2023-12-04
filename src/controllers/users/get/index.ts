import { GetUserRequest, GetUserResponse } from '@lunaticenslaved/schema/actions';

import { createOperation } from '#/context';

export const get = createOperation<GetUserResponse, GetUserRequest>(async (request, _, context) => {
  const { userId } = request.body;
  const user = await context.service.user.get({ userId }, 'strict');

  return { user };
});
