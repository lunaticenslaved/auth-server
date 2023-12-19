import { ValidateRequestRequest, ValidateRequestResponse } from '@lunaticenslaved/schema/actions';

import { createOperation } from '#/context';
import { createSessionNotFoundError } from '#/errors';
import { Session } from '#/models';
import { tokens } from '#/utils';

export const validateRequest = createOperation<ValidateRequestResponse, ValidateRequestRequest>(
  async (request, _, context) => {
    const { service } = request.body;

    const accessToken = tokens.access.get(request) || '';
    const refreshToken = tokens.refresh.get(request) || '';

    let session: Session | undefined = undefined;

    if (accessToken && tokens.access.isValid(accessToken)) {
      session = await context.service.session.get({ accessToken }, 'strict');
    }

    if (!session && refreshToken && tokens.refresh.isValid(refreshToken)) {
      session = await context.service.session.get({ refreshToken }, 'strict');
    }

    if (!session) {
      tokens.access.isValidOrThrowError(accessToken);
      tokens.refresh.isValidOrThrowError(refreshToken);

      throw createSessionNotFoundError();
    } else {
      tokens.access.isValidOrThrowError(session.accessToken);
      tokens.refresh.isValidOrThrowError(session.refreshToken);
    }

    const data = tokens.access.getExpirationDate(session.accessToken);
    const user = await context.service.user.get({ userId: session.userId }, 'strict');
    await context.service.user.addInService({ userId: session.userId, service });

    return {
      user,
      token: session.accessToken,
      expiresAt: data.toISOString(),
    };
  },
);
