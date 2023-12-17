import { Validation, Validators } from '@lunaticenslaved/schema';
import { UpdateAvatarResponse } from '@lunaticenslaved/schema/actions';

import { Context } from '#/context';

type Request = {
  userId: string;
  filename: string;
  buffer: Buffer;
};

type Response = UpdateAvatarResponse;

const validators = {
  buffer: Validators.required('File is required'),
};

export async function updateAvatar(request: Request, context: Context): Promise<Response> {
  const { userId, filename, buffer } = request;

  await Validation.validate(validators, request);

  const { link } = await context.storage.avatar.uploadFile({
    buffer,
    filename,
  });
  const user = await context.service.user.update({
    userId,
    uploadedAvatar: link,
  });

  return { user };
}
