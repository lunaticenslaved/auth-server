import { Express } from 'express';

import { Error } from '@lunaticenslaved/schema';

import { addAuthRoutes } from './auth';
import { addViewerRoutes } from './viewer';

export const addRouter = (app: Express) => {
  addAuthRoutes(app);
  addViewerRoutes(app);

  app.use('/api/*', (_, response) => {
    response.status(404).json(
      new Error.NotFoundError({
        messages: ['Resource not found'],
        status: 400,
      }),
    );
  });
};
