import { createOperation } from '#/context';

interface ListUsersRequestQuery {
  userIds: string[];
}

export const list = createOperation(async (request, _, context) => {
  const { userIds } = request.query as unknown as ListUsersRequestQuery;
  const user = await context.service.user.list({ userIds });

  return { user };
});
