import { Mock } from '@/__mocks__';
import { ValidationError } from '@/errors';

import { signIn } from './sign-in';
import { createUserWithLoginNotExistsError, createInvalidPasswordError } from './errors';

import { signUp } from '../sign-up/sign-up';

describe('test validation', () => {
  test('cannot sign in without password', async () => {
    const promise = signIn(
      {
        userAgent: 'chrome',
        login: 'user',
        password: '',
      },
      Mock.context,
    );

    await expect(promise).rejects.toThrow(ValidationError);
  });

  test('cannot sign in without login', async () => {
    const promise = signIn(
      {
        userAgent: 'chrome',
        login: '',
        password: 'user',
      },
      Mock.context,
    );

    await expect(promise).rejects.toThrow(ValidationError);
  });
});

test('cannot sign in when user not exits', async () => {
  const promise = signIn(
    {
      userAgent: 'chrome',
      login: 'login',
      password: 'password',
    },
    Mock.context,
  );

  await expect(promise).rejects.toThrow(createUserWithLoginNotExistsError('login'));
});

test('cannot sign in because of invalid password', async () => {
  const data = {
    userAgent: 'chrome',
    login: 'login',
    password: 'password',
  };

  await signUp(data, Mock.context);

  const promise = signUp(
    {
      ...data,
      password: 'invalid password',
    },
    Mock.context,
  );

  await expect(promise).rejects.toThrow(createInvalidPasswordError());
});
