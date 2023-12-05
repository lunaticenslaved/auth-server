import { Request } from 'express';

import { Errors } from '@lunaticenslaved/schema';

import { getAccessToken, getAccessTokenData, getRefreshToken, getRefreshTokenData } from './tokens';

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
      token = getAccessToken(req, 'strict');
      tokenType = 'access';
    } catch {
      token = getRefreshToken(req, 'strict');
      tokenType = 'refresh';
    }

    if (tokenType === 'refresh') {
      const { userId } = getRefreshTokenData(token, 'strict');
      return userId;
    }

    const { userId } = getAccessTokenData(token, 'strict');
    return userId;
  }

  const accessToken = getAccessToken(req);

  if (accessToken) {
    const { userId } = getAccessTokenData(accessToken) || {};

    return userId;
  } else {
    const refreshToken = getRefreshToken(req);

    if (!refreshToken) return undefined;

    const { userId } = getRefreshTokenData(refreshToken) || {};

    return userId;
  }
}
