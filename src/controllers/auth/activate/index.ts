import { ActivateRequest, ActivateResponse } from '@lunaticenslaved/schema/actions';

import { createOperation } from '#/context';

export const activate = createOperation<ActivateResponse, ActivateRequest>(
  async (req, _, context) => {
    const { activationToken } = req.body;

    const userId = context.service.mail.getUserIdFromActivationToken(activationToken);
    const user = await context.service.user.activate({ userId });

    return { user };
  },
);
