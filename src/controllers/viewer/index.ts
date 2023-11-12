import { addUserFromCookie, checkAuth } from '#/middlewares';
import { createRoutes } from '#/utils';

import { updateAvatar } from './update-avatar';
import { updateInfo } from './update-info';
import { updatePassword } from './update-password';

export const addViewerRoutes = createRoutes(app => {
  app.post('/api/viewer/password', addUserFromCookie, checkAuth, updatePassword);
  app.post('/api/viewer/info', addUserFromCookie, checkAuth, updateInfo);
  app.post('/api/viewer/avatar', addUserFromCookie, checkAuth, updateAvatar);
});
