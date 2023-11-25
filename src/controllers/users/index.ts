import { createRoutes } from '#/utils';

import { get } from './get';
import { list } from './list';

export const addUsersRoutes = createRoutes(app => {
  app.get('/api/users/:userId', get);
  app.get('/api/users', list);
});
