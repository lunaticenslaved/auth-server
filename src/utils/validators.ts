import { z } from 'zod';

import { Validator } from '@/utils';

export const required =
  (message: string = 'Value is required'): Validator<unknown> =>
  value =>
    value ? undefined : message;

function zodWrapper<T>(fn: z.ZodType<T>) {
  return (value?: T) => {
    const result = fn.safeParse(value);

    if ('error' in result) {
      return result.error.message;
    }

    return null;
  };
}

export const email: Validator<string> = zodWrapper(
  z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email('Invalid email format'),
);

export const login: Validator<string> = zodWrapper(
  z.string({
    required_error: 'Login is required',
    invalid_type_error: 'Login must be a string',
  }),
);

export const newPassword: Validator<string> = zodWrapper(
  z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
);
