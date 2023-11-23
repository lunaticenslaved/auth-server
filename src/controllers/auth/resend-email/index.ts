import { createOperation } from '#/context';
import { RequestUtils } from '#/utils';

export const resendEmail = createOperation(async (req, _, context) => {
  const userId = RequestUtils.getUserId(req, 'strict');

  const { email } = await context.service.user.get({ userId }, 'strict');

  await context.service.mail.sendUserActivationMail({
    email,
    userId,
  });
});
