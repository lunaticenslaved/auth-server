import { PrismaClient } from '@prisma/client';

import { SessionService } from './session';
import { UserService } from './user';

export interface IService {
  session: SessionService;
  user: UserService;
}

export function createService(prisma: PrismaClient): IService {
  return {
    user: new UserService(prisma),
    session: new SessionService(prisma),
  };
}
