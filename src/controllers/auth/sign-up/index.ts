import { createOperation } from '#/utils';
import { ValidationError } from '#/errors';

import { signUp as action } from './sign-up';
import { SignUpRequest, SignUpResponse } from './types';

export const signUp = createOperation<SignUpRequest, SignUpResponse>(
  async ({ body, headers }, res, context) => {
    const userAgent = headers['user-agent'];

    if (!userAgent) {
      throw new ValidationError({ errors: [`Unknown user agent`] });
    }

    const { accessToken, user } = await action({ ...body, userAgent }, context);

    res.cookie('accessToken', accessToken);

    return { user };
  },
);
