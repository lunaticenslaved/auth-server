import { Prisma } from '@prisma/client';
import { Types } from '@prisma/client/runtime/library';

import { User } from '#/models';

export const select: Prisma.UserSelect<Types.Extensions.DefaultArgs> = {
  id: true,
  login: true,
  email: true,
  isActivated: true,
  avatars: {
    take: 1,
    where: {
      isCurrent: true,
    },
    select: {
      id: true,
      link: true,
      isCurrent: true,
    },
  },
};

type NotPreparedUser = {
  id: string;
  login: string;
  email: string;
  isActivated: boolean;
  avatars: Array<{
    id: string;
    link: string;
    isCurrent: boolean;
  }>;
};

export function prepare({ avatars, ...user }: NotPreparedUser): User {
  const [avatar] = avatars;

  return {
    id: user.id,
    login: user.login,
    email: user.email,
    isActivated: user.isActivated,
    avatar: avatar || null,
  };
}
