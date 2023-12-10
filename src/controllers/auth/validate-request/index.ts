import { ValidateRequestResponse } from '@lunaticenslaved/schema/actions';

import { createOperation } from '#/context';
import { tokens } from '#/utils';

export const validateRequest = createOperation<ValidateRequestResponse, void>(
  async (request, _, context) => {
    const accessToken = tokens.access.get(request);
    const refreshToken = tokens.refresh.get(request) || '';

    if (accessToken && !refreshToken) {
      tokens.access.isValidOrThrowError(accessToken);
    }

    tokens.refresh.isValidOrThrowError(refreshToken || '');

    const { accessToken: savedAccessToken, userId } = await context.service.session.get(
      { refreshToken },
      'strict',
    );

    tokens.access.isValidOrThrowError(savedAccessToken);

    const data = tokens.access.getExpirationDate(savedAccessToken);
    const user = await context.service.user.get({ userId }, 'strict');

    return {
      user,
      token: savedAccessToken,
      expiresAt: data.toISOString(),
    };
  },
);
