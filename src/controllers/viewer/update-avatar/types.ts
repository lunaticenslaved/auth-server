import '@prisma/client';

import { Schema } from '@lunaticenslaved/schema';

import { UserDTO } from '#/dto';

export type UpdateAvatarRequest = Schema.Operation.Viewer.UpdateAvatar.Request;

export type UpdateAvatarResponse = {
  user: UserDTO.User;
};
