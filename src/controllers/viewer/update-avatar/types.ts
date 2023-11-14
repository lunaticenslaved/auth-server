import { UploadedFile } from 'express-fileupload';

import '@prisma/client';

import { Operation } from '@lunaticenslaved/schema';

export type UpdateAvatarRequest = Omit<Operation.Viewer.UpdateAvatarRequest, 'avatar'> & {
  avatar: UploadedFile;
};
export type UpdateAvatarResponse = Operation.Viewer.UpdateAvatarResponse;
