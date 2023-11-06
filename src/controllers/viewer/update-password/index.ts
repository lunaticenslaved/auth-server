import { createOperation, getUserFromRequest } from '@/utils';

import { UpdatePasswordRequest, UpdatePasswordResponse } from './types';
import { updatePassword as action } from './action';

export const updatePassword = createOperation<UpdatePasswordRequest, UpdatePasswordResponse>(
  async (request, _, context) => {
    const user = getUserFromRequest(request);

    const response = await action({ userId: user.id, ...request.body }, context);

    return response;
  },
);
