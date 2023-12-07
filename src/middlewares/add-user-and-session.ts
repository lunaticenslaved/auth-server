import { NextFunction, Request, Response } from 'express';

import { Context } from '#/context';
import { Session } from '#/models';
import { logger, tokens } from '#/utils';

export const addUserAndSession =
  (context: Context) => async (request: Request, response: Response, next: NextFunction) => {
    logger.info('[MIDDLEWARE][GET USER AND SESSION]: Start');

    const accessToken = tokens.access.get(request);

    if (accessToken && tokens.access.isValid(accessToken)) {
      const { userId, sessionId } = tokens.access.getData(accessToken) || {};

      logger.info(`[MIDDLEWARE][GET USER AND SESSION]: Data retrieved from access token:
    - userId: ${userId}
    - sessionId: ${sessionId}`);

      request.userId = userId;
      request.sessionId = sessionId;

      return next();
    }

    const refreshToken = tokens.refresh.get(request);

    if (!refreshToken) {
      return next();
    }

    let session: Session;

    try {
      session = await context.service.session.get({ refreshToken }, 'strict');
    } catch (e) {
      console.log(e);

      logger.warn(`[MIDDLEWARE][GET USER AND SESSION]: A session with the token was not found`);
      tokens.removeTokensFormResponse(response);

      return next();
    }

    if (!tokens.refresh.isValid(refreshToken)) {
      await context.service.session.delete({ refreshToken });

      tokens.removeTokensFormResponse(response);

      logger.warn(
        `[MIDDLEWARE][GET USER AND SESSION]: Invalid refresh token. The session was deleted`,
      );

      return next();
    }

    try {
      const sessionId = session.id;
      const { userId } = tokens.access.getData(refreshToken, 'strict');

      logger.info(`[MIDDLEWARE][GET USER AND SESSION]: Data retrieved from refresh token:
    - userId: ${userId}
    - sessionId: ${sessionId}`);

      request.userId = userId;
      request.sessionId = sessionId;

      return next();
    } catch (e) {
      await context.service.session.delete({ refreshToken });

      tokens.removeTokensFormResponse(response);

      logger.error(
        `[MIDDLEWARE][GET USER AND SESSION]: Cannot get refresh token's data. The session was deleted`,
      );

      throw e;
    }
  };
