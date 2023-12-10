import { Request } from 'express';

import jwt from 'jsonwebtoken';

import { Errors } from '@lunaticenslaved/schema';

import { ACCESS_TOKEN_EXPIRES_IN, ACCESS_TOKEN_SECRET } from '#/utils/constants';

import { AccessTokenData, CreateRefreshTokenResponse } from './types';
import { checkIfTokenIsValid } from './utils';

export function create(data: AccessTokenData): CreateRefreshTokenResponse {
  const token = jwt.sign(data, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  const { exp } = jwt.decode(token) as { exp: number };

  return {
    token,
    expiresAt: new Date(exp * 1000),
  };
}

export function isValidOrThrowError(token: string): boolean {
  return checkIfTokenIsValid({ accessToken: token });
}

export function isValid(token: string): boolean {
  try {
    checkIfTokenIsValid({ accessToken: token });

    return true;
  } catch {
    return false;
  }
}

export function getData(token: string, type: 'strict'): AccessTokenData;
export function getData(token: string): AccessTokenData | undefined;
export function getData(token: string, type?: 'strict'): AccessTokenData | undefined {
  try {
    checkIfTokenIsValid({ accessToken: token });

    const data = jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenData;

    return data;
  } catch (error) {
    if (type === 'strict') {
      throw error;
    }

    return undefined;
  }
}

export function get(req: Request, type: 'strict'): string;
export function get(req: Request): string | undefined;
export function get(req: Request, type?: 'strict'): string | undefined {
  const token = req.headers['authorization']?.split(' ')?.[1] as string | undefined;

  if (type === 'strict' && !token) {
    throw new Errors.UnauthorizedError({ messages: 'Unknown token' });
  }

  return token;
}

export function getExpirationDate(accessToken: string) {
  const { exp } = jwt.decode(accessToken) as { exp: number };
  return new Date(exp * 1000);
}
