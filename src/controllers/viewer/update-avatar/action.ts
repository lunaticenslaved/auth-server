import { Validators, Validation } from '@lunaticenslaved/schema';

import { Context } from '#/context';
import { UserDTO } from '#/dto';

import { UpdateAvatarRequest, UpdateAvatarResponse } from './types';

type Request = UpdateAvatarRequest & {
  userId: string;
};

type Response = UpdateAvatarResponse;

const validators = {
  avatar: Validators.required('File is required'),
};

export async function updateAvatar(request: Request, context: Context): Promise<Response> {
  await Validation.validateRequest(validators, request);

  const { link } = await context.storage.avatar.uploadFile(request.avatar);
  const user = await context.prisma.user.update({
    where: {
      id: request.userId,
    },
    data: {
      avatars: {
        create: { link },
      },
    },
    select: UserDTO.selector,
  });

  return { user: UserDTO.prepare(user) };
}
