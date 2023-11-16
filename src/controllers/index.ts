import { Express } from 'express';

import { Errors } from '@lunaticenslaved/schema';

import { addTokenData } from '#/middlewares';

import { addAuthRoutes } from './auth';
import { addViewerRoutes } from './viewer';

export const addRouter = (app: Express) => {
  app.use('/api/*', addTokenData);

  addAuthRoutes(app);
  addViewerRoutes(app);

  app.use('/api/*', (_, response) => {
    response.status(404).json(
      new Errors.NotFoundError({
        messages: ['Resource not found'],
        status: 400,
      }),
    );
  });
};
