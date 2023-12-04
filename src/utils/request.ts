import { Request } from 'express';

import { Errors } from '@lunaticenslaved/schema';

import { getTokenData, getTokens } from './tokens';

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
  const { accessToken } = getTokens(req, type);

  if (!accessToken) return undefined;

  const { userId } = getTokenData({ accessToken }, type);

  return userId;
}
