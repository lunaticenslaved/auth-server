import { PrismaClient } from '@prisma/client';

import { createOperationWithContext } from '#/utils/operation';

import { IService, createService } from './service';
import { IStorage, createStorage } from './storage';

export type { IService, IStorage };
export type { IMailService } from './service/mail';

const prisma = new PrismaClient();

type CreateContext = {
  prisma: PrismaClient;
  storage: IStorage;
  mailService?: IService['mail'];
};

export class Context {
  prisma: PrismaClient;
  storage: IStorage;
  service: IService;

  constructor({ storage, prisma, mailService }: CreateContext) {
    this.prisma = prisma;
    this.storage = storage;
    this.service = createService(prisma);

    if (mailService) {
      this.service.mail = mailService;
    }
  }
}

export const context = new Context({
  prisma,
  storage: createStorage(),
});

export const createOperation = createOperationWithContext(context);
