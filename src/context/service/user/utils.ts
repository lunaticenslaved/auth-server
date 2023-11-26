import { User } from '#/models';

export const select = {
  id: true,
  login: true,
  email: true,
  isActivated: true,
  avatars: {
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

export function prepare(user: NotPreparedUser): User {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    isActivated: user.isActivated,
    avatar: user.avatars.find(({ isCurrent }) => !!isCurrent) || null,
  };
}
