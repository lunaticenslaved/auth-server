import { RefreshRequest, RefreshResponse } from '@lunaticenslaved/schema/actions';

import { createOperation } from '#/context';
import { RequestUtils, tokens } from '#/utils';

export const refresh = createOperation<RefreshResponse, RefreshRequest>(
  async (req, res, context) => {
    const { fingerprint } = req.body;
    const refreshToken = tokens.refresh.get(req, 'strict');

    tokens.refresh.isValidOrThrowError(refreshToken);

    const session = await context.service.session.get({ refreshToken }, 'strict');
    const userAgent = RequestUtils.getUserAgent(req);
    const ip = RequestUtils.getIP(req);
    const sessionState = await context.service.session.checkSession({
      refreshToken,
      fingerprint,
    });

    if (sessionState === 'expired') {
      await context.service.session.delete({ sessionId: session.id });

      throw new Error('Session expired');
    } else if (sessionState === 'not-exists') {
      throw new Error('Session not exists');
    } else if (sessionState === 'unknown-fingerprint') {
      await context.service.session.delete({ sessionId: session.id });

      throw new Error('Unknown fingerprint');
    }

    // update session with new refresh token
    const newRefreshToken = tokens.refresh.create({ userId: session.userId });
    const newSession = await context.service.session.save({
      ip,
      userAgent,
      sessionId: session.id,
      fingerprint: session.fingerprint,
      refreshToken: newRefreshToken.token,
      expiresAt: newRefreshToken.expiresAt,
      userId: session.userId,
    });

    // create access token
    const accessToken = tokens.access.create({
      userId: newSession.userId,
      sessionId: newSession.id,
    });

    tokens.setTokensToResponse(newRefreshToken, res);

    return {
      user: await context.service.user.get({ userId: session.userId }, 'strict'),
      token: accessToken.token,
      expiresAt: accessToken.expiresAt.toISOString(),
    };
  },
);
