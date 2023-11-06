import bcrypt from 'bcrypt';

import { Validators, createHash, validateRequest } from '@/utils';
import { getUserSelector } from '@/models/user';
import { Context } from '@/context';

import { createIncorrectPasswordError, createSamePasswordError } from './errors';
import { UpdatePasswordRequest, UpdatePasswordResponse } from './types';

type Request = UpdatePasswordRequest & {
  userId: string;
};

type Response = UpdatePasswordResponse;

const validators = {
  oldPassword: Validators.required('Old password is required'),
  newPassword: Validators.newPassword,
};

export async function updatePassword(request: Request, context: Context): Promise<Response> {
  await validateRequest(validators, request);

  const user = await context.prisma.user.findFirst({
    where: {
      id: { equals: request.userId },
    },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    throw Error('Unknown user!');
  }

  const { oldPassword, newPassword } = request;

  if (!(await bcrypt.compare(oldPassword, user.password))) {
    throw createIncorrectPasswordError();
  }

  if (await bcrypt.compare(newPassword, user.password)) {
    throw createSamePasswordError();
  }

  const updatedUser = await context.prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: {
        set: await createHash(newPassword),
      },
    },
    select: getUserSelector(),
  });

  return { user: updatedUser };
}
