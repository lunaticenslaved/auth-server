import { UploadedFile } from 'express-fileupload';

import '@prisma/client';

import {
  UpdateAvatarRequest as SchemaUpdateAvatarRequest,
  UpdateAvatarResponse as SchemaUpdateAvatarResponse,
} from '@lunaticenslaved/schema/actions';

export type UpdateAvatarRequest = Omit<SchemaUpdateAvatarRequest, 'avatar'> & {
  avatar: UploadedFile;
};
export type UpdateAvatarResponse = SchemaUpdateAvatarResponse;
