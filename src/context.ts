import { PrismaClient } from '@prisma/client';

import { IService, IStorage, createService, createStorage } from '#/services';
import { createOperationWithContext } from '#/utils/operation';

const prisma = new PrismaClient();

type CreateContext = {
  prisma: PrismaClient;
  storage: IStorage;
};

export class Context {
  prisma: PrismaClient;
  storage: IStorage;
  service: IService;

  constructor({ storage, prisma }: CreateContext) {
    this.prisma = prisma;
    this.storage = storage;
    this.service = createService(prisma);
  }
}

export const context = new Context({
  prisma,
  storage: createStorage(),
});

export const createOperation = createOperationWithContext(context);
