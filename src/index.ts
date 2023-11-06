import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

import { prisma } from '@/services/prisma';
import { Constants } from '@/utils';
import { addRouter } from '@/controllers';

export async function createApp() {
  await prisma.$connect();

  const app = express();

  app.disable('x-powered-by');
  app.disable('via');

  app.use(fileUpload());
  app.use(cookieParser());
  app.use(cors());
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
