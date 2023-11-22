import { PrismaClient } from '@prisma/client';

import { SessionService, Storage, UserService, storage } from '#/services';
import { createOperationWithContext } from '#/utils/operation';

const prisma = new PrismaClient();

type CreateContext = {
  prisma: PrismaClient;
  storage: Storage;
};

export class Context {
  prisma: PrismaClient;
  storage: Storage;
  services: {
    session: SessionService;
    user: UserService;
  };

  constructor({ storage, prisma }: CreateContext) {
    this.prisma = prisma;
    this.storage = storage;
    this.services = {
      session: new SessionService(this),
      user: new UserService(this),
    };
  }
}

export const context = new Context({ storage, prisma });

export const createOperation = createOperationWithContext(context);
