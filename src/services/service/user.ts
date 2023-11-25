import { PrismaClient } from '@prisma/client';

import { Errors } from '@lunaticenslaved/schema';

import { User } from '#/dto/user';

const select = {
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
    }
  | {
      email: string;
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
  isActivated: boolean;
  avatars: AvatarNotPrepared[];
};

type ActivateRequest = {
  userId: string;
};

function prepare(user: NotPreparedUser): User {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    isActivated: user.isActivated,
    avatar: user.avatars.find(({ isCurrent }) => !!isCurrent) || null,
  };
}

export function createUserNotFoundError() {
  return new Errors.UnauthorizedError({ messages: 'User not found' });
}
export class UserService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: CreateUserRequest): Promise<User> {
    const user = await this.prisma.user.create({
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
    const user = await this.prisma.user.update({
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

  async get(props: GetUserRequest, type: 'strict'): Promise<User>;
  async get(props: GetUserRequest): Promise<User | undefined>;
  async get(props: GetUserRequest, type?: 'strict'): Promise<User | undefined> {
    const user = await this.prisma.user.findFirst({
      where: {
        ...('login' in props ? { login: props.login } : {}),
        ...('email' in props ? { email: props.email } : {}),
        ...('userId' in props ? { id: props.userId } : {}),
      },
      select,
    });

    if (!user && type === 'strict') {
      throw createUserNotFoundError();
    }

    return user ? prepare(user) : undefined;
  }

  async getPassword(props: GetUserRequest): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: {
        ...('login' in props ? { login: props.login } : {}),
        ...('email' in props ? { email: props.email } : {}),
        ...('userId' in props ? { id: props.userId } : {}),
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

  async activate({ userId }: ActivateRequest) {
    const user = await this.prisma.user
      .update({
        where: {
          id: userId,
        },
        data: {
          isActivated: true,
        },
        select,
      })
      .catch(() => {
        throw createUserNotFoundError();
      });

    return user ? prepare(user) : undefined;
  }
}
