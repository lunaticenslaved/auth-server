import { ListSessionsResponse } from '@lunaticenslaved/schema/actions';

import { createOperation } from '#/context';
import { RequestUtils } from '#/utils';

export const list = createOperation<ListSessionsResponse, void>(async (request, _, context) => {
  const userId = RequestUtils.getUserId(request, 'strict');
  const sessions = await context.service.session.list({ userId });

  return {
    sessions: sessions.map(session => ({
      id: session.id,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
      userAgent: session.userAgent,
      ip: session.ip,
    })),
  };
});
