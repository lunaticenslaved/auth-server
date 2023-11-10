import { Express } from 'express';

import { NotFoundError } from '#/errors';

import { addAuthRoutes } from './auth';
import { addViewerRoutes } from './viewer';

export const addRouter = (app: Express) => {
  addAuthRoutes(app);
  addViewerRoutes(app);

  app.use('/api/*', (_, response) => {
    response.status(404).json(
      new NotFoundError({
        errors: ['Resource not found'],
        status: 400,
      }),
    );
  });
};
