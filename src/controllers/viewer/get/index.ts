import { createOperation } from '#/context';
import { RequestUtils } from '#/utils';

export const get = createOperation(async (request, _, context) => {
  const userId = RequestUtils.getUserId(request, 'strict');
  const user = await context.service.user.get({ userId });

  return { user };
});
