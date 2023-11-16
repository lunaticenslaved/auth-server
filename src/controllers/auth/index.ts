import { createRoutes } from '#/utils';

import { logout } from './logout';
import { refresh } from './refresh';
import { signIn } from './sign-in';
import { signUp } from './sign-up';

export const addAuthRoutes = createRoutes(app => {
  app.post('/api/auth/sign-in', signIn);
  app.post('/api/auth/sign-up', signUp);
  app.post('/api/auth/logout', logout);
  app.post('/api/auth/refresh', refresh);
});
