import jwt, { TokenExpiredError } from 'jsonwebtoken';

import { Errors } from '@lunaticenslaved/schema';

import { logger } from '#/utils';
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
    logger.info(`[TOKEN] Check access token is valid`);

    try {
      jwt.verify(req.accessToken, ACCESS_TOKEN_SECRET);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        logger.error(`[TOKEN] Access token is expired`);
        throw new Errors.TokenExpiredError({ messages: 'Access token expired' });
      }

      logger.error(`[TOKEN] Access token is invalid: ${(error as Error).message}`);
      throw new Errors.TokenInvalidError({ messages: 'Invalid token' });
    }
  } else {
    logger.info(`[TOKEN] Check refresh token is valid`);

    try {
      jwt.verify(req.refreshToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        logger.error(`[TOKEN] Refresh token is expired`);
        throw new Errors.RefreshTokenExpiredError({ messages: 'Refresh token expired' });
      }

      logger.error(`[TOKEN] Refresh token is invalid: ${(error as Error).message}`);
      throw new Errors.TokenInvalidError({ messages: 'Invalid token' });
    }
  }

  return true;
}
