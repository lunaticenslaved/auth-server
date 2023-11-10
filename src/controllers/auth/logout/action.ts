import { User } from '@prisma/client';

import { Context } from '#/context';

type Request = {
  userId: User['id'];
  accessToken: string;
};

export async function logout({ accessToken, userId }: Request, context: Context) {
  await context.prisma.session.deleteMany({
    where: {
      user: { id: { equals: userId } },
      accessToken: { equals: accessToken },
    },
  });
}
