import express from 'express';

// import { prisma } from '@/prisma';

import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

const PORT = 3000;

export async function createApp() {
  // await prisma.$connect();

  const app = express();

  app.disable('x-powered-by');
  app.disable('via');

  app.use(fileUpload());
  app.use(cookieParser());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.listen(PORT, () => {
    console.log(
      `  ➜ 🎸 [DEV] Server is listening on port: ${PORT}. Use this server: http://localhost:${PORT}`,
    );
  });
}


createApp();
