import { Validator } from '@/utils';

export const required =
  (message: string = 'Value is required'): Validator<unknown> =>
  value =>
    value ? undefined : message;

export const email: Validator<string> = required('Email is required');

export const login: Validator<string> = required('Login is required');

export const newPassword: Validator<string> = required('Password is required');
