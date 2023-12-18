import { PrismaClient } from '@prisma/client';

import { createSessionNotFoundError } from '#/errors';

import {
  DeleteSessionRequest,
  DeleteSessionResponse,
  GetSessionRequest,
  GetSessionResponse,
  ListSessionsRequest,
  ListSessionsResponse,
  SaveSessionRequest,
  SaveSessionResponse,
} from './types';

export class SessionService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async save(data: SaveSessionRequest): Promise<SaveSessionResponse> {
    const { userId, sessionId, ...tokenData } = data;

    if (!sessionId) {
      return await this.prisma.session.create({
        data: {
          ...tokenData,
          userId,
        },
      });
    }

    return await this.prisma.session.update({
      where: { id: sessionId },
      data: tokenData,
    });
  }

  async delete(data: DeleteSessionRequest): Promise<DeleteSessionResponse> {
    console.log('DELETE SESSION', JSON.stringify(data));

    if ('sessionId' in data) {
      await this.prisma.session.deleteMany({
        where: { id: { equals: data.sessionId } },
      });
    } else {
      await this.prisma.session.deleteMany({
        where: { refreshToken: { equals: data.refreshToken } },
      });
    }
  }

  async get(data: GetSessionRequest, type: 'strict'): Promise<GetSessionResponse>;
  async get(data: GetSessionRequest): Promise<GetSessionResponse | undefined>;
  async get(data: GetSessionRequest, type?: 'strict'): Promise<GetSessionResponse | undefined> {
    if ('sessionId' in data) {
      const { sessionId } = data;
      const session = await this.prisma.session.findFirst({
        where: { id: sessionId },
      });

      if (!session && type === 'strict') {
        throw createSessionNotFoundError();
      }

      return session || undefined;
    } else if ('refreshToken' in data) {
      const { refreshToken } = data;
      const session = await this.prisma.session.findFirst({
        where: { refreshToken },
      });

      if (!session && type === 'strict') {
        throw createSessionNotFoundError();
      }

      return session || undefined;
    } else if ('accessToken' in data) {
      const { accessToken } = data;
      const session = await this.prisma.session.findFirst({
        where: { accessToken },
      });

      if (!session && type === 'strict') {
        throw createSessionNotFoundError();
      }

      return session || undefined;
    } else {
      const { fingerprint, userId } = data;
      const session = await this.prisma.session.findFirst({
        where: {
          userId: { equals: userId },
          fingerprint: { equals: fingerprint },
        },
      });

      if (!session && type === 'strict') {
        throw createSessionNotFoundError();
      }

      return session || undefined;
    }
  }

  async list({ userId }: ListSessionsRequest): Promise<ListSessionsResponse> {
    return this.prisma.session.findMany({
      where: { userId },
    });
  }
}
