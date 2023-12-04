import { Request } from 'express';

import { Errors } from '@lunaticenslaved/schema';

import { getAccessToken, getAccessTokenData } from './tokens';

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
    const accessToken = getAccessToken(req, 'strict');
    const { userId } = getAccessTokenData(accessToken, 'strict');
    return userId;
  }

  const accessToken = getAccessToken(req);

  if (!accessToken) return undefined;

  const { userId } = getAccessTokenData(accessToken) || {};

  return userId;
}
