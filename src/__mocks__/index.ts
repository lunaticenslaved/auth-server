import { UploadedFile } from 'express-fileupload';

import { PrismaClient } from '@prisma/client';

import { Context } from '#/context';
import { Request, signUp } from '#/controllers/auth/sign-up/action';
import { Storage } from '#/services';

jest.mock('./prisma');

const storage: Storage = {
  avatar: {
    uploadFile(_: UploadedFile) {
      return Promise.resolve({ link: 'filepath' });
    },
  },
};

const context = new Context({
  storage,
  prisma: new PrismaClient(),
});

export const Mock = {
  context,

  utils: {
    createUser(data: Request) {
      return signUp(data, context);
    },
  },
};
