import { createOperation } from '#/context';
import { User } from '#/models';

interface ActivateRequestBody {
  activationToken: string;
}

interface ActivateResponse {
  user: User;
}

export const activate = createOperation<ActivateResponse>(async (req, _, context) => {
  const { activationToken } = req.body as ActivateRequestBody;

  const userId = context.service.mail.getUserIdFromActivationToken(activationToken);
  const user = await context.service.user.activate({ userId });

  return { user };
});
