import { checkAuth } from '#/middlewares';
import { createRoutes } from '#/utils';

import { get } from './get';
import { updateAvatar } from './update-avatar';
import { updateInfo } from './update-info';
import { updatePassword } from './update-password';

export const addViewerRoutes = createRoutes(app => {
  app.post('/api/viewer/update-password', checkAuth, updatePassword);
  app.post('/api/viewer/update-info', checkAuth, updateInfo);
  app.post('/api/viewer/update-avatar', checkAuth, updateAvatar);
  app.post('/api/viewer/get', get);
});
