import { UploadedFile } from 'express-fileupload';

import { UserDTO } from '#/dto';

export type UpdateAvatarRequest = {
  avatar: UploadedFile;
};

export type UpdateAvatarResponse = {
  user: UserDTO.User;
};
