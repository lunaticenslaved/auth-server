import { Errors } from '@lunaticenslaved/schema';

import { Context } from '#/context';
import { User } from '#/dto/user';

const select = {
  id: true,
  login: true,
  email: true,
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
  email: string;
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
  email: string;
  avatars: AvatarNotPrepared[];
};

function prepare(user: NotPreparedUser): User {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    avatar: user.avatars.find(({ isCurrent }) => !!isCurrent) || null,
  };
}

export function createUserNotFoundError() {
  return new Errors.UnauthorizedError({ messages: 'User not found' });
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
        email: data.email,
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

  async get<T extends 'strict'>(
    props: GetUserRequest,
    type?: T,
  ): Promise<T extends 'strict' ? User : User | undefined>;
  async get<T extends 'strict'>(props: GetUserRequest, type?: T): Promise<User | undefined> {
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

    if (!user && type === 'strict') {
      throw createUserNotFoundError();
    }

    return user ? prepare(user) : undefined;
  }

  async getPassword(props: GetUserRequest): Promise<string> {
    const user = await this.context.prisma.user.findFirst({
      where:
        'login' in props
          ? {
              login: props.login,
            }
          : {
              id: props.userId,
            },
      select: {
        password: true,
      },
    });

    if (!user) {
      throw createUserNotFoundError();
    }

    return user.password;
  }
}
