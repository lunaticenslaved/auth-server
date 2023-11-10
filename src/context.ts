import { PrismaClient } from '@prisma/client';
import { prisma, storage, Storage } from '#/services';

export type Context = {
  prisma: PrismaClient;
  storage: Storage;
};

export const context: Context = {
  prisma,
  storage,
};
