import { Context } from '@/context';
import { User, getUserSelector } from '@/models/user';
import { Validators, validateRequest } from '@/utils';

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
  await validateRequest(validators, request);

  const user = await context.prisma.user.update({
    where: {
      id: request.userId,
    },
    data: {
      login: { set: request.login },
    },
    select: getUserSelector(),
  });

  return { user };
}
