import { RefreshRequest, RefreshResponse } from '@lunaticenslaved/schema/actions';

import { createOperation } from '#/context';
import { RequestUtils, tokens } from '#/utils';

export const refresh = createOperation<RefreshResponse, RefreshRequest>(
  async (req, res, context) => {
    const { fingerprint } = req.body;
    const refreshToken = tokens.refresh.get(req, 'strict');
    const session = await context.service.session.get({ refreshToken }, 'strict');
    const userAgent = RequestUtils.getUserAgent(req);
    const ip = RequestUtils.getIP(req);

    if (fingerprint === session.fingerprint) {
      await context.service.session.delete({ sessionId: session.id });

      throw new Error('Unknown fingerprint');
    }

    // create access token
    const accessToken = tokens.access.create({ userId: session.userId });

    // update session with new refresh token
    const newRefreshToken = tokens.refresh.create({ userId: session.userId });

    await context.service.session.save({
      ip,
      userAgent,
      sessionId: session.id,
      fingerprint: session.fingerprint,
      refreshToken: newRefreshToken.token,
      accessToken: accessToken.token,
      expiresAt: newRefreshToken.expiresAt,
      userId: session.userId,
    });

    tokens.setTokensToResponse(newRefreshToken, res);

    return {
      user: await context.service.user.get({ userId: session.userId }, 'strict'),
      token: accessToken.token,
      expiresAt: accessToken.expiresAt.toISOString(),
    };
  },
);
