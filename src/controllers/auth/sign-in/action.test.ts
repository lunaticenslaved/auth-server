import { Errors } from '@lunaticenslaved/schema';

import { Mock } from '#/__mocks__';

import { signIn } from './action';
import { createInvalidPasswordError, createUserWithLoginNotExistsError } from './errors';

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

    await expect(promise).rejects.toThrow(Errors.ValidationError);
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

    await expect(promise).rejects.toThrow(Errors.ValidationError);
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

  await Mock.utils.createUser(data);

  const promise = signIn(
    {
      ...data,
      password: 'invalid password',
    },
    Mock.context,
  );

  await expect(promise).rejects.toThrow(createInvalidPasswordError());
});
