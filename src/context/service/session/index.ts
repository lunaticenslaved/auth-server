import { PrismaClient } from '@prisma/client';

import { createSessionNotFoundError } from '#/errors';

import {
  CheckSessionRequest,
  CheckSessionResponse,
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
    const { userId, userAgent, sessionId, ip, fingerprint, expiresAt, refreshToken } = data;

    const session = await this.prisma.session.upsert({
      where: { id: sessionId || '' },
      create: {
        userId,
        userAgent,
        ip,
        fingerprint,
        expiresAt,
        refreshToken,
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

  async checkSession({
    refreshToken,
    fingerprint,
  }: CheckSessionRequest): Promise<CheckSessionResponse> {
    const session = await this.prisma.session.findFirst({
      where: { refreshToken },
    });

    if (!session) {
      return 'not-exists';
    }

    if (session.fingerprint !== fingerprint) {
      return 'unknown-fingerprint';
    }

    if (new Date() >= session.expiresAt) {
      return 'expired';
    }

    return 'valid';
  }

  // TODO add strict
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
}
