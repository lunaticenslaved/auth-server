import jwt, { TokenExpiredError } from 'jsonwebtoken';

import { Errors } from '@lunaticenslaved/schema';

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '#/utils/constants';

type TokenDataRequest =
  | {
      refreshToken: string;
    }
  | {
      accessToken: string;
    };

export function checkIfTokenIsValid(req: TokenDataRequest): boolean {
  if ('accessToken' in req) {
    try {
      jwt.verify(req.accessToken, ACCESS_TOKEN_SECRET);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new Errors.TokenExpiredError({ messages: 'Access token expired' });
      }

      throw new Errors.TokenInvalidError({ messages: 'Invalid token' });
    }
  } else {
    try {
      jwt.verify(req.refreshToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new Errors.RefreshTokenExpiredError({ messages: 'Refresh token expired' });
      }

      throw new Errors.TokenInvalidError({ messages: 'Invalid token' });
    }
  }

  return true;
}
