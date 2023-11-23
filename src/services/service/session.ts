import { PrismaClient, Session } from '@prisma/client';

type SaveSessionRequest = {
  userId: string;
  userAgent: string;
  sessionId?: string;
};

type DeleteSessionRequest = {
  sessionId: string;
};

type GetSessionRequest = {
  sessionId: string;
};

export class SessionService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async save(data: SaveSessionRequest): Promise<Session> {
    const { userId, userAgent, sessionId } = data;

    const session = await this.prisma.session.upsert({
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

  async delete({ sessionId }: DeleteSessionRequest) {
    return await this.prisma.session.deleteMany({
      where: { id: { equals: sessionId } },
    });
  }

  // TODO add strict
  async get({ sessionId }: GetSessionRequest) {
    return await this.prisma.session.findFirst({
      where: { id: sessionId },
    });
  }
}
