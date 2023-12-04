import { RefreshRequest, RefreshResponse } from '@lunaticenslaved/schema/actions';

import { createOperation } from '#/context';
import { RequestUtils, TokensUtils } from '#/utils';

export const refresh = createOperation<RefreshResponse, RefreshRequest>(
  async (req, res, context) => {
    const { fingerprint } = req.body;
    const refreshToken = TokensUtils.getRefreshToken(req, 'strict');
    const session = await context.service.session.get({
      refreshToken,
    });

    const userAgent = RequestUtils.getUserAgent(req);
    const ip = RequestUtils.getIP(req);

    if (!session) {
      throw new Error('Session not exists');
    }

    const sessionState = await context.service.session.checkSession({
      refreshToken,
      fingerprint,
    });

    if (sessionState === 'expired') {
      throw new Error('Session expired');
    } else if (sessionState === 'not-exists') {
      throw new Error('Session not exists');
    } else if (sessionState === 'unknown-fingerprint') {
      throw new Error('Unknown fingerprint');
    }

    // update session with new refresh token
    const newRefreshToken = TokensUtils.createRefreshToken({ userId: session.userId });
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
    const accessToken = TokensUtils.createAccessToken({
      userId: newSession.userId,
      sessionId: newSession.id,
    });

    TokensUtils.setTokensToResponse(newRefreshToken, res);

    return {
      user: await context.service.user.get({ userId: session.userId }, 'strict'),
      token: accessToken.token,
      expiresAt: accessToken.expiresAt.toISOString(),
    };
  },
);
