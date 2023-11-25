import { UploadedFile } from 'express-fileupload';

import { PrismaClient } from '@prisma/client';

import { Context, IMailService, IStorage } from '#/context';
import { Request, signUp } from '#/controllers/auth/sign-up/action';

jest.mock('./prisma');

const storage: IStorage = {
  avatar: {
    uploadFile(_: UploadedFile) {
      return Promise.resolve({ link: 'filepath' });
    },
  },
};

const mailService: IMailService = {
  sendUserActivationMail: jest.fn(_ => null),
  getUserIdFromActivationToken() {
    return '';
  },
};

afterEach(() => {
  (mailService.sendUserActivationMail as jest.Mock).mockClear();
});

const context = new Context({
  storage,
  prisma: new PrismaClient(),
  mailService,
});

export const Mock = {
  context,

  utils: {
    createUser(data: Request) {
      return signUp(data, context);
    },
  },
};
