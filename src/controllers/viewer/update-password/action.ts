import bcrypt from 'bcryptjs';

import { Validation, Validators } from '@lunaticenslaved/schema';
import { UpdatePasswordRequest, UpdatePasswordResponse } from '@lunaticenslaved/schema/actions';

import { Context } from '#/context';
import { createHash } from '#/utils';

import { createIncorrectPasswordError, createSamePasswordError } from './errors';

type Request = UpdatePasswordRequest & {
  userId: string;
};

type Response = UpdatePasswordResponse;

const validators = {
  oldPassword: Validators.required('Old password is required'),
  newPassword: Validators.newPassword,
};

export async function updatePassword(request: Request, context: Context): Promise<Response> {
  const { userId, ...data } = request;

  await Validation.validate(validators, data);

  const { password: savedPassword } = await context.prisma.user.findFirstOrThrow({
    where: { id: userId },
    select: { password: true },
  });

  const { oldPassword, newPassword } = request;

  if (!(await bcrypt.compare(oldPassword, savedPassword))) {
    throw createIncorrectPasswordError();
  }

  if (await bcrypt.compare(newPassword, savedPassword)) {
    throw createSamePasswordError();
  }

  const user = await context.service.user.update({
    userId,
    password: await createHash(newPassword),
  });

  return { user };
}
