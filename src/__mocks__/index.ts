import { UploadedFile } from 'express-fileupload';

import { Context } from '#/context';
import { Request, signUp } from '#/controllers/auth/sign-up/action';
import { Storage, prisma } from '#/services';

jest.mock('./prisma');

const storage: Storage = {
  avatar: {
    uploadFile(_: UploadedFile) {
      return Promise.resolve({ link: 'filepath' });
    },
  },
};

const context: Context = {
  prisma,
  storage,
};

export const Mock = {
  context,

  utils: {
    createUser(data: Request) {
      return signUp(data, context);
    },
  },
};
