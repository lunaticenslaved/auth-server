import { Request } from 'express';

import { Errors } from '@lunaticenslaved/schema';

import { tokens } from './tokens';

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
  if (type === 'strict') {
    let token = '';
    let tokenType = 'access';

    try {
      token = tokens.access.get(req, 'strict');
      tokenType = 'access';
    } catch {
      token = tokens.refresh.get(req, 'strict');
      tokenType = 'refresh';
    }

    if (tokenType === 'refresh') {
      const { userId } = tokens.refresh.getData(token, 'strict');
      return userId;
    }

    const { userId } = tokens.access.getData(token, 'strict');
    return userId;
  }

  const accessToken = tokens.access.get(req);

  if (accessToken) {
    const { userId } = tokens.access.getData(accessToken) || {};

    return userId;
  } else {
    const refreshToken = tokens.refresh.get(req);

    if (!refreshToken) return undefined;

    const { userId } = tokens.refresh.getData(refreshToken) || {};

    return userId;
  }
}
