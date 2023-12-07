import express from 'express';
import fileUpload from 'express-fileupload';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { context } from '#/context';
import { addRouter } from '#/controllers';
import { addUserAndSession, logRequest } from '#/middlewares';
import { Constants, logger } from '#/utils';
import { DOMAIN } from '#/utils/constants';

export async function createApp() {
  await context.prisma.$connect();

  const app = express();

  app.disable('x-powered-by');
  app.disable('via');

  app.use(fileUpload());
  app.use(cookieParser());

  app.use(logRequest);

  app.use(addUserAndSession(context));

  app.use(
    cors({
      credentials: true,
      origin: function (origin, callback) {
        if (origin?.endsWith(DOMAIN)) {
          logger.info(`[CORS]: origin '${origin}' allowed`);
          callback(null, true);
        } else {
          logger.error(`[CORS]: origin '${origin}' not allowed`);
          callback(new Error('Not allowed by CORS'));
        }
      },
    }),
  );
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  addRouter(app);

  app.listen(Constants.PORT, () => {
    logger.info(
      `  ➜ 🎸 [DEV] Server is listening on port: ${Constants.PORT}. Use this server: http://localhost:${Constants.PORT}`,
    );
  });
}

createApp();
