import { Validation, Validators } from '@lunaticenslaved/schema';

import { Context } from '#/context';
import { User } from '#/models';

type Request = {
  userId: string;
  login: string;
};

type Response = {
  user: User;
};

const validators = {
  login: Validators.login,
};

export async function updateInfo(request: Request, context: Context): Promise<Response> {
  const { userId, login } = request;
  await Validation.validate(validators, request);

  const user = await context.service.user.update(userId, { login });

  return { user };
}
