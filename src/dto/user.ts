type Avatar = {
  id: string;
  link: string;
};

type AvatarNotPrepared = {
  id: string;
  link: string;
  isCurrent: boolean;
};

export type User = {
  id: string;
  login: string;
  avatar: Avatar | null;
};

export const selector = {
  id: true,
  login: true,
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
  avatars: AvatarNotPrepared[];
};

export function prepare(user: NotPreparedUser): User {
  return {
    id: user.id,
    login: user.login,
    avatar: user.avatars.find(({ isCurrent }) => !!isCurrent) || null,
  };
}
