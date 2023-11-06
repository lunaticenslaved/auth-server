import { createOperation } from '@/utils';
import { ValidationError } from '@/errors';

import { signIn as action } from './sign-in';
import { SignInRequest, SignInResponse } from './types';

export const signIn = createOperation<SignInRequest, SignInResponse>(
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
