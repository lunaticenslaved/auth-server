import express from 'express';
import fileUpload from 'express-fileupload';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { context } from '#/context';
import { addRouter } from '#/controllers';
import { Constants } from '#/utils';

export async function createApp() {
  await context.prisma.$connect();

  const app = express();

  app.disable('x-powered-by');
  app.disable('via');

  app.use(fileUpload());
  app.use(cookieParser());

  const whitelist = ['http://localhost:3000'];
  app.use(
    cors({
      credentials: true,
      origin: function (origin, callback) {
        if (origin && whitelist.includes(origin)) {
          callback(null, true);
        } else {
          console.log('origin:', origin, 'not allowed');
          callback(new Error('Not allowed by CORS'));
        }
      },
    }),
  );
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  addRouter(app);

  app.listen(Constants.PORT, () => {
    console.log(
      `  ➜ 🎸 [DEV] Server is listening on port: ${Constants.PORT}. Use this server: http://localhost:${Constants.PORT}`,
    );
  });
}

createApp();
