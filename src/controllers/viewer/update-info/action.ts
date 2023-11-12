import { Validation, Validators } from '@lunaticenslaved/schema';

import { Context } from '#/context';
import { UserDTO } from '#/dto';

type Request = {
  userId: string;
  login: string;
};

type Response = {
  user: UserDTO.User;
};

const validators = {
  login: Validators.login,
};

export async function updateInfo(request: Request, context: Context): Promise<Response> {
  await Validation.validateRequest(validators, request);

  const user = await context.prisma.user.update({
    where: {
      id: request.userId,
    },
    data: {
      login: { set: request.login },
    },
    select: UserDTO.selector,
  });

  return { user: UserDTO.prepare(user) };
}
