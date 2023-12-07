import { Request } from 'express';

import { Errors } from '@lunaticenslaved/schema';

export function getUserAgent({ headers }: Request) {
  const userAgent = headers['user-agent'];

  if (!userAgent) {
    throw new Errors.ValidationError({ messages: [`Unknown user agent`] });
  }

  return userAgent;
}

export function getIP({ headers }: Request) {
  const ip = headers['x-real-ip'];

  if (!ip) {
    throw new Errors.ValidationError({ messages: [`Unknown ip`] });
  }

  return ip as string;
}

export function getUserId(req: Request): string | undefined;
export function getUserId(req: Request, type: 'strict'): string;
export function getUserId(req: Request, type?: 'strict'): string | undefined {
  const { userId } = req;

  if (type === 'strict' && !userId) {
    throw new Errors.UnauthorizedError({ messages: 'User not found' });
  }

  return userId;
}

export function getSessionId(req: Request): string | undefined;
export function getSessionId(req: Request, type: 'strict'): string;
export function getSessionId(req: Request, type?: 'strict'): string | undefined {
  const { sessionId } = req;

  if (type === 'strict' && !sessionId) {
    throw new Errors.UnauthorizedError({ messages: 'Session not found' });
  }

  return sessionId;
}
