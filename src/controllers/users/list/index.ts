import { createOperation } from '#/context';

type ListUsersRequestQuery =
  | {
      userIds: string[];
      search: string;
    }
  | {
      search: string;
      take: number;
    };

export const list = createOperation(async (request, _, context) => {
  const query = request.query as unknown as ListUsersRequestQuery;
  const user =
    'userIds' in query
      ? await context.service.user.list({ userIds: query.userIds, search: query.search })
      : await context.service.user.list({ search: query.search, take: query.take });

  return { user };
});
