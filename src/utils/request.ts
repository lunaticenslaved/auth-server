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
    let tokenType: keyof typeof tokens = 'access';

    try {
      token = tokens.access.get(req, 'strict');
      tokenType = 'access';
    } catch {
      token = tokens.refresh.get(req, 'strict');
      tokenType = 'refresh';
    }

    return tokens[tokenType].getData(token, 'strict').userId;
  } else {
    let token: string | undefined = '';
    let tokenType: keyof typeof tokens = 'access';

    token = tokens.access.get(req);
    tokenType = 'access';

    if (!token) {
      token = tokens.refresh.get(req);
      tokenType = 'refresh';
    }

    if (!token) {
      return undefined;
    }

    return tokens[tokenType].getData(token)?.userId;
  }
}
