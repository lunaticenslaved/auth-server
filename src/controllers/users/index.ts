import { createRoutes } from '#/utils';

import { get } from './get';
import { list } from './list';

export const addUsersRoutes = createRoutes(app => {
  app.post('/api/users/get', get);
  app.post('/api/users/list', list);
});
