import { Request } from 'express';

import jwt from 'jsonwebtoken';

import { Errors } from '@lunaticenslaved/schema';

import { Constants } from '#/utils';

import { CreateRefreshTokenResponse, RefreshTokenData } from './types';
import { checkIfTokenIsValid } from './utils';

export function create(data: RefreshTokenData): CreateRefreshTokenResponse {
  const token = jwt.sign(data, Constants.REFRESH_TOKEN_SECRET, {
    expiresIn: Constants.REFRESH_TOKEN_EXPIRES_IN,
  });

  const { exp } = jwt.decode(token) as { exp: number };

  return {
    token,
    expiresAt: new Date(exp * 1000),
  };
}

export function isValidOrThrowError(token: string): boolean {
  return checkIfTokenIsValid({ refreshToken: token });
}

export function isValid(token: string): boolean {
  try {
    checkIfTokenIsValid({ refreshToken: token });

    return true;
  } catch {
    return false;
  }
}

export function getData(token: string, type: 'strict'): RefreshTokenData;
export function getData(token: string): RefreshTokenData | undefined;
export function getData(token: string, type?: 'strict'): RefreshTokenData | undefined {
  try {
    checkIfTokenIsValid({ refreshToken: token });

    const data = jwt.verify(token, Constants.REFRESH_TOKEN_SECRET as string) as RefreshTokenData;

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
  const token = req.cookies['refreshToken'] as string;

  if (type === 'strict' && !token) {
    throw new Errors.UnauthorizedError({ messages: 'Unknown token' });
  }

  return token;
}
