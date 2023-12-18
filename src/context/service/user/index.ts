import { PrismaClient } from '@prisma/client';

import { createUserNotFoundError } from '#/errors';

import {
  ActivateUserRequest,
  ActivateUserResponse,
  CreateUserRequest,
  CreateUserResponse,
  GetUserRequest,
  GetUserResponse,
  ListUsersRequest,
  ListUsersResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from './types';
import { prepare, select } from './utils';

export class UserService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: CreateUserRequest): Promise<CreateUserResponse> {
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

  async update(data: UpdateUserRequest): Promise<UpdateUserResponse> {
    const { userId } = data;
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.password ? { password: { set: data.password } } : {}),
        ...(data.login ? { login: { set: data.login } } : {}),
        ...(data.uploadedAvatar
          ? { avatars: { create: { link: data.uploadedAvatar, isCurrent: true } } }
          : undefined),
      },
      select,
    });

    return prepare(user);
  }

  async get(props: GetUserRequest, type: 'strict'): Promise<GetUserResponse>;
  async get(props: GetUserRequest): Promise<GetUserResponse | undefined>;
  async get(props: GetUserRequest, type?: 'strict'): Promise<GetUserResponse | undefined> {
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

  async activate({ userId }: ActivateUserRequest): Promise<ActivateUserResponse> {
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

    return prepare(user);
  }

  async list(data: ListUsersRequest): Promise<ListUsersResponse> {
    const { userIds, search, take } = data;
    const users = await this.prisma.user.findMany({
      select,
      take: userIds?.length || take || 20,
      where: {
        isActivated: true,
        ...(userIds?.length ? { id: { in: userIds } } : {}),
        ...(search
          ? {
              OR: [
                {
                  login: { contains: search },
                },
                {
                  email: { contains: search },
                },
              ],
            }
          : {}),
      },
    });

    return users.map(prepare);
  }
}
