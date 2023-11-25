import { checkAuth } from '#/middlewares';
import { createRoutes } from '#/utils';

import { get } from './get';
import { updateAvatar } from './update-avatar';
import { updateInfo } from './update-info';
import { updatePassword } from './update-password';

export const addViewerRoutes = createRoutes(app => {
  app.post('/api/viewer/password', checkAuth, updatePassword);
  app.post('/api/viewer/info', checkAuth, updateInfo);
  app.post('/api/viewer/avatar', checkAuth, updateAvatar);
  app.get('/api/viewer', get);
});
