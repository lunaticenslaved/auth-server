import { addUserFromCookie } from '#/middlewares';
import { createRoutes } from '#/utils';

import { logout } from './logout';
import { signIn } from './sign-in';
import { signUp } from './sign-up';

export const addAuthRoutes = createRoutes(app => {
  app.post('/api/auth/sign-in', addUserFromCookie, signIn);
  app.post('/api/auth/sign-up', addUserFromCookie, signUp);
  app.post('/api/auth/logout', addUserFromCookie, logout);
});
