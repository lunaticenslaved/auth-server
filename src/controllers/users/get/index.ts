import { createOperation } from '#/context';

interface GetUserRequestParams {
  userId: string;
}

export const get = createOperation(async (request, _, context) => {
  const { userId } = request.params as unknown as GetUserRequestParams;
  const user = await context.service.user.get({ userId });

  return { user };
});
