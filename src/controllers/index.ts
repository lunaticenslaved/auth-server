import { Express } from 'express';

import { Errors } from '@lunaticenslaved/schema';

import { addAuthRoutes } from './auth';
import { addUsersRoutes } from './users';
import { addViewerRoutes } from './viewer';

export const addRouter = (app: Express) => {
  addAuthRoutes(app);
  addViewerRoutes(app);
  addUsersRoutes(app);

  app.use('/api/*', (_, response) => {
    response.status(404).json(
      new Errors.NotFoundError({
        messages: ['Resource not found'],
        status: 400,
      }),
    );
  });
};
