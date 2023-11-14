import { Error } from '@lunaticenslaved/schema';

import { createOperation } from '#/context';

import { signUp as action } from './action';

export const signUp = createOperation(async ({ body, headers }, res, context) => {
  const userAgent = headers['user-agent'];

  if (!userAgent) {
    throw new Error.ValidationError({ messages: [`Unknown user agent`] });
  }

  const { accessToken, user } = await action({ ...body, userAgent }, context);

  res.cookie('accessToken', accessToken);

  return { user };
});
