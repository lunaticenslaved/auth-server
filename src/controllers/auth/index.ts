import { createRoutes } from '#/utils';

import { activate } from './activate';
import { logout } from './logout';
import { refresh } from './refresh';
import { resendEmail } from './resend-email';
import { signIn } from './sign-in';
import { signUp } from './sign-up';

export const addAuthRoutes = createRoutes(app => {
  app.post('/api/auth/sign-in', signIn);
  app.post('/api/auth/sign-up', signUp);
  app.post('/api/auth/logout', logout);
  app.post('/api/auth/refresh', refresh);
  app.post('/api/auth/resend-email', resendEmail);
  app.post('/api/auth/*', activate);
});
