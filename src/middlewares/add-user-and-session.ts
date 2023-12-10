import { NextFunction, Request, Response } from 'express';

import { Context } from '#/context';
import { logger, tokens } from '#/utils';

export const addUserAndSession =
  (context: Context) => async (request: Request, response: Response, next: NextFunction) => {
    logger.info('[MIDDLEWARE][GET USER ID]: Start');

    const accessToken = tokens.access.get(request);

    if (!accessToken) {
      logger.warn(`[MIDDLEWARE][GET USER ID]: Access token not found`);
    } else if (tokens.access.isValid(accessToken)) {
      const { userId } = tokens.access.getData(accessToken) || {};

      logger.info(`[MIDDLEWARE][GET USER ID]: Data retrieved from access token:
    - userId: ${userId}`);

      request.userId = userId;

      return next();
    } else {
      logger.warn(`[MIDDLEWARE][GET USER ID]: Access token is invalid`);
    }

    const refreshToken = tokens.refresh.get(request);

    if (!refreshToken) {
      logger.warn(`[MIDDLEWARE][GET USER ID]: Refresh token not found`);

      return next();
    }

    try {
      await context.service.session.get({ refreshToken }, 'strict');
    } catch (e) {
      logger.warn(`[MIDDLEWARE][GET USER ID]: A session with the token was not found`);
      tokens.removeTokensFormResponse(response);

      return next();
    }

    if (!tokens.refresh.isValid(refreshToken)) {
      await context.service.session.delete({ refreshToken });

      tokens.removeTokensFormResponse(response);

      logger.warn(`[MIDDLEWARE][GET USER ID]: Invalid refresh token. The session was deleted`);

      return next();
    }

    try {
      const { userId } = tokens.refresh.getData(refreshToken, 'strict');

      logger.info(`[MIDDLEWARE][GET USER ID]: Data retrieved from refresh token:
    - userId: ${userId} `);

      request.userId = userId;

      return next();
    } catch (e) {
      await context.service.session.delete({ refreshToken });

      tokens.removeTokensFormResponse(response);

      logger.error(
        `[MIDDLEWARE][GET USER ID]: Cannot get refresh token's data. The session was deleted`,
      );

      throw e;
    }
  };
