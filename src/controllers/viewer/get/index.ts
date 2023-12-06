import { GetViewerResponse } from '@lunaticenslaved/schema/actions';

import { createOperation } from '#/context';
import { RequestUtils, logger } from '#/utils';

export const get = createOperation<GetViewerResponse, void>(async (request, _, context) => {
  logger.info('[API][VIEWER] Get viewer');

  const userId = RequestUtils.getUserId(request, 'strict');

  logger.info('[API][VIEWER] User id found ' + userId);

  const user = await context.service.user.get({ userId }, 'strict');

  logger.info('[API][VIEWER] User found');

  return { user };
});
