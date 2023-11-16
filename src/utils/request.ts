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

export function getSessionId<T extends 'strict' | undefined>(
  req: Request,
  type?: T,
): T extends undefined ? string | undefined : string;
export function getSessionId<T extends 'strict' | undefined>(
  req: Request,
  type?: T,
): string | undefined {
  const { accessToken } = getTokens(req, type);
  const { sessionId } = getTokenData({ accessToken }, 'strict');

  return sessionId;
}

export function getUserId<T extends 'strict' | undefined>(
  req: Request,
  type?: T,
): T extends undefined ? string | undefined : string;
export function getUserId<T extends 'strict' | undefined>(
  req: Request,
  type?: T,
): string | undefined {
  const { accessToken } = getTokens(req, type);

  const { userId } = getTokenData({ accessToken }, 'strict');

  return userId;
}
