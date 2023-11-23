import { createOperation } from '#/context';

interface ActivateRequestBody {
  activationToken: string;
}

export const activate = createOperation(async (req, _, context) => {
  const { activationToken } = req.body as ActivateRequestBody;

  const userId = context.service.mail.getUserIdFromActivationToken(activationToken);
  const user = await context.service.user.activate({ userId });

  return { user };
});
