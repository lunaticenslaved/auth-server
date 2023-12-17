import { Errors } from '@lunaticenslaved/schema';
import { UpdateAvatarRequest, UpdateAvatarResponse } from '@lunaticenslaved/schema/actions';

import { createOperation } from '#/context';
import { RequestUtils } from '#/utils';

import { updateAvatar as action } from './action';

const FORMATS = ['image/jpeg', 'image/png'];

export const updateAvatar = createOperation<UpdateAvatarResponse, UpdateAvatarRequest>(
  async (request, _, context) => {
    const { mimetype, fileBase64, filename } = request.body;

    if (!FORMATS.includes(mimetype)) {
      throw new Errors.ValidationError({
        messages: 'Invalid file. Please upload a JPEG or PNG file only.',
      });
    }

    const binaryData = Buffer.from(fileBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    const { user } = await action(
      {
        filename,
        userId: RequestUtils.getUserId(request, 'strict'),
        buffer: binaryData,
      },
      context,
    );

    return { user };
  },
);
