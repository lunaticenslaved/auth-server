import { PrismaClient } from '@prisma/client';

import { IMailService, MailService } from './mail';
import { SessionService } from './session';
import { UserService } from './user';

export interface IService {
  session: SessionService;
  user: UserService;
  mail: IMailService;
}

export function createService(prisma: PrismaClient): IService {
  return {
    user: new UserService(prisma),
    session: new SessionService(prisma),
    mail: new MailService(),
  };
}
