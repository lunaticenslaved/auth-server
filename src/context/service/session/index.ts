import { PrismaClient } from '@prisma/client';

import { createSessionNotFoundError } from '#/errors';

import {
  DeleteSessionRequest,
  DeleteSessionResponse,
  GetSessionRequest,
  GetSessionResponse,
  SaveSessionRequest,
  SaveSessionResponse,
} from './types';

export class SessionService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async save(data: SaveSessionRequest): Promise<SaveSessionResponse> {
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

  async delete({ sessionId }: DeleteSessionRequest): Promise<DeleteSessionResponse> {
    await this.prisma.session.deleteMany({
      where: { id: { equals: sessionId } },
    });
  }

  // TODO add strict
  async get({ sessionId }: GetSessionRequest): Promise<GetSessionResponse> {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId },
    });

    if (!session) {
      throw createSessionNotFoundError();
    }

    return session || undefined;
  }
}
