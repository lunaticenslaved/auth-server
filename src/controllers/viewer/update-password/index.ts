import { UpdatePasswordRequest, UpdatePasswordResponse } from '@lunaticenslaved/schema/actions';

import { createOperation } from '#/context';
import { RequestUtils } from '#/utils';

import { updatePassword as action } from './action';

export const updatePassword = createOperation<UpdatePasswordResponse, UpdatePasswordRequest>(
  async (request, _, context) => {
    const { oldPassword, newPassword } = request.body;

    const response = await action(
      {
        userId: RequestUtils.getUserId(request, 'strict'),
        oldPassword,
        newPassword,
      },
      context,
    );

    return response;
  },
);
