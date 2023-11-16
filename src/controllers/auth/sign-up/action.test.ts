import { Errors } from '@lunaticenslaved/schema';

import { Mock } from '#/__mocks__';

import { signUp } from './action';
import { createUserWithLoginExistsError } from './errors';

describe('test validation', () => {
  test('cannot sign up without password', async () => {
    const promise = signUp(
      {
        userAgent: 'chrome',
        login: 'user',
        password: '',
      },
      Mock.context,
    );

    await expect(promise).rejects.toThrow(Errors.ValidationError);
  });

  test('cannot sign up without login', async () => {
    const promise = signUp(
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

test('can sign up', async () => {
  const { user } = await signUp(
    {
      userAgent: 'chrome',
      login: 'login',
      password: 'password',
    },
    Mock.context,
  );

  expect(user.login).toBe('login');
});

test('cannot sign up with the same login', async () => {
  const data = {
    userAgent: 'chrome',
    login: 'login',
    password: 'password',
  };

  await signUp(data, Mock.context);

  const promise = signUp(data, Mock.context);

  await expect(promise).rejects.toThrow(createUserWithLoginExistsError(data.login));
});
