import { PrismaClient } from '@prisma/client';

import { Storage, prisma, storage } from '#/services';

export type Context = {
  prisma: PrismaClient;
  storage: Storage;
};

export const context: Context = {
  prisma,
  storage,
};
