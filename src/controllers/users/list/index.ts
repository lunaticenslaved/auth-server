import { ListUsersRequest, ListUsersResponse } from '@lunaticenslaved/schema/actions';

import { createOperation } from '#/context';

export const list = createOperation<ListUsersResponse, ListUsersRequest>(
  async (request, _, context) => {
    const query = request.body;
    const users =
      'userIds' in query
        ? await context.service.user.list({ userIds: query.userIds, search: query.search })
        : await context.service.user.list({ search: query.search, take: query.take });

    return { users };
  },
);
