import { PrismaClient } from '@prisma/client';

import Schema from '@lunaticenslaved/schema';

import { Storage, prisma, storage } from '#/services';

export type Context = {
  prisma: PrismaClient;
  storage: Storage;
};

export const context: Context = {
  prisma,
  storage,
};

export const createOperation = Schema.Operation.createOperationWithContext(context);
