import { UploadedFile } from 'express-fileupload';

import { User } from '@/models/user';

export type UpdateAvatarRequest = {
  avatar: UploadedFile;
};

export type UpdateAvatarResponse = {
  user: User;
};
