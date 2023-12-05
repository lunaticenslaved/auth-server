import jwt, { TokenExpiredError } from 'jsonwebtoken';

import { Errors } from '@lunaticenslaved/schema';

import { Constants, logger } from '#/utils';

type TokenDataRequest =
  | {
      refreshToken: string;
    }
  | {
      accessToken: string;
    };

export function checkIfTokenIsValid(req: TokenDataRequest): void {
  if ('accessToken' in req) {
    logger.info(`[TOKEN] Check access token is valid`);

    try {
      jwt.verify(req.accessToken, Constants.ACCESS_TOKEN_SECRET as string);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        logger.error(`[TOKEN] Access token is expired`);
        throw new Errors.TokenExpiredError({ messages: 'Access token expired' });
      }

      logger.error(`[TOKEN] Access token is invalid`);
      throw new Errors.TokenInvalidError({ messages: 'Invalid token' });
    }
  } else {
    logger.info(`[TOKEN] Check refresh token is valid`);

    try {
      jwt.verify(req.refreshToken, Constants.REFRESH_TOKEN_SECRET as string);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        logger.error(`[TOKEN] Refresh token is expired`);
        throw new Errors.RefreshTokenExpiredError({ messages: 'Refresh token expired' });
      }

      logger.error(`[TOKEN] Refresh token is invalid`);
      throw new Errors.TokenInvalidError({ messages: 'Invalid token' });
    }
  }
}
