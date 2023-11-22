import { Errors } from '@lunaticenslaved/schema';

import { Mock } from '#/__mocks__';

import { signIn } from './action';
import { createInvalidPasswordError, createUserWithLoginNotExistsError } from './errors';

describe('test validation', () => {
  test('require password', async () => {
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

  test('require login', async () => {
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

test('user should exit', async () => {
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

test('check invalid password', async () => {
  const data = {
    userAgent: 'chrome',
    login: 'login',
    email: 'test@test.ru',
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
