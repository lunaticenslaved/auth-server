import { ListUsersRequest, ListUsersResponse } from '@lunaticenslaved/schema/actions';

import { createOperation } from '#/context';

export const list = createOperation<ListUsersResponse, ListUsersRequest>(
  async (request, _, context) => {
    const { userIds, take, search, services, excludeIds } = request.body;
    const users = await context.service.user.list({ services, userIds, search, take, excludeIds });

    return { users };
  },
);
