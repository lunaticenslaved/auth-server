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

export function getSessionId(req: Request): string | undefined;
export function getSessionId(req: Request, type: 'strict'): string;
export function getSessionId(req: Request, type?: 'strict'): string | undefined {
  const { accessToken } = getTokens(req, type);

  if (!accessToken) return undefined;

  const { sessionId } = getTokenData({ accessToken }, type);

  return sessionId;
}

export function getUserId(req: Request): string | undefined;
export function getUserId(req: Request, type: 'strict'): string;
export function getUserId(req: Request, type?: 'strict'): string | undefined {
  const { accessToken } = getTokens(req, type);

  if (!accessToken) return undefined;

  const { userId } = getTokenData({ accessToken }, type);

  return userId;
}
