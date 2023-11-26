import { createOperation } from '#/context';
import { User } from '#/models';

interface SearchUsersRequestQuery {
  search: string;
}

interface SearchUsersResponse {
  users: User[];
}

export const search = createOperation<SearchUsersResponse>(async (request, _, context) => {
  const { search } = request.query as unknown as SearchUsersRequestQuery;
  const users = await context.service.user.search({ search });

  return { users };
});
