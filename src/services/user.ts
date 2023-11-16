import { Errors } from '@lunaticenslaved/schema';

import { Context } from '#/context';
import { User } from '#/dto/user';

const select = {
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

type CreateUserRequest = {
  login: string;
  password: string;
};

type GetUserRequest =
  | {
      userId: string;
    }
  | {
      login: string;
    };

type UpdateRequest = {
  login?: string;
  uploadedAvatar?: string;
  password?: string;
};

type AvatarNotPrepared = {
  id: string;
  link: string;
  isCurrent: boolean;
};

type NotPreparedUser = {
  id: string;
  login: string;
  avatars: AvatarNotPrepared[];
};

function prepare(user: NotPreparedUser): User {
  return {
    id: user.id,
    login: user.login,
    avatar: user.avatars.find(({ isCurrent }) => !!isCurrent) || null,
  };
}

export class UserService {
  private context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  async create(data: CreateUserRequest): Promise<User> {
    const user = await this.context.prisma.user.create({
      select,
      data: {
        login: data.login,
        password: data.password,
      },
    });

    return prepare(user);
  }

  async update(userId: string, data: UpdateRequest): Promise<User> {
    const user = await this.context.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.password ? { password: { set: data.password } } : {}),
        ...(data.login ? { login: { set: data.login } } : {}),
        ...(data.uploadedAvatar
          ? { avatars: { create: { link: data.uploadedAvatar } } }
          : undefined),
      },
      select,
    });

    return prepare(user);
  }

  async get(props: GetUserRequest): Promise<User> {
    const user = await this.context.prisma.user.findFirst({
      where:
        'login' in props
          ? {
              login: props.login,
            }
          : {
              id: props.userId,
            },
      select,
    });

    if (!user) {
      throw new Errors.UnauthorizedError({
        messages: 'User not found',
        status: 403,
      });
    }

    return prepare(user);
  }
}
