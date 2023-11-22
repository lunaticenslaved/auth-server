import { Validation, Validators } from '@lunaticenslaved/schema';

import { Context } from '#/context';

import { UpdateAvatarRequest, UpdateAvatarResponse } from './types';

type Request = UpdateAvatarRequest & {
  userId: string;
};

type Response = UpdateAvatarResponse;

const validators = {
  avatar: Validators.required('File is required'),
};

export async function updateAvatar(request: Request, context: Context): Promise<Response> {
  const { userId, avatar } = request;

  await Validation.validate(validators, request);

  const { link } = await context.storage.avatar.uploadFile(avatar);
  const user = await context.service.user.update(userId, {
    uploadedAvatar: link,
  });

  return { user };
}
