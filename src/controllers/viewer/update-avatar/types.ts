import { UserDTO } from '#/dto';
import { Schema } from '@lunaticenslaved/schema';

export type UpdateAvatarRequest = Schema.Operation.Viewer.UpdateAvatar.Request;

export type UpdateAvatarResponse = {
  user: UserDTO.User;
};
