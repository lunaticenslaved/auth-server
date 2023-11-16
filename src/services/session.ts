import { Session } from '@prisma/client';

import { Context } from '#/context';

type SaveSessionRequest = {
  userId: string;
  userAgent: string;
  sessionId?: string;
};

export class SessionService {
  private context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  async save(data: SaveSessionRequest): Promise<Session> {
    const { userId, userAgent, sessionId } = data;

    const session = await this.context.prisma.session.upsert({
      where: { id: sessionId || '' },
      create: {
        userId,
        userAgent,
      },
      update: {
        userAgent,
      },
    });

    return session;
  }
}
