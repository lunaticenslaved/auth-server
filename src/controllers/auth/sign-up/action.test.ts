import { Errors } from '@lunaticenslaved/schema';

import { Mock } from '#/__mocks__';

import { signUp } from './action';
import { createUserWithEmailExistsError, createUserWithLoginExistsError } from './errors';

describe('test validation', () => {
  test('require password', async () => {
    const promise = signUp(
      {
        userAgent: 'chrome',
        login: 'user',
        email: 'test@test.ru',
        password: '',
      },
      Mock.context,
    );

    await expect(promise).rejects.toThrow(Errors.ValidationError);
  });

  test('require login', async () => {
    const promise = signUp(
      {
        userAgent: 'chrome',
        email: 'test@test.ru',
        login: '',
        password: 'user',
      },
      Mock.context,
    );

    await expect(promise).rejects.toThrow(Errors.ValidationError);
  });

  test('require email', async () => {
    const promise = signUp(
      {
        userAgent: 'chrome',
        email: '',
        login: 'login',
        password: 'user',
      },
      Mock.context,
    );

    await expect(promise).rejects.toThrow(Errors.ValidationError);
  });

  test('no existing login', async () => {
    const data = {
      userAgent: 'chrome',
      email: 'test@test.ru',
      login: 'login',
      password: 'password',
    };

    await Mock.utils.createUser(data);

    const newData = { ...data, email: 'new@email.ru' };
    const promise = signUp(newData, Mock.context);

    await expect(promise).rejects.toThrow(createUserWithLoginExistsError(data.login));
  });

  test('no existing email', async () => {
    const data = {
      userAgent: 'chrome',
      email: 'test@test.ru',
      login: 'login',
      password: 'password',
    };

    await Mock.utils.createUser(data);

    const newData = { ...data, login: 'newLogin' };
    const promise = signUp(newData, Mock.context);

    await expect(promise).rejects.toThrow(createUserWithEmailExistsError(data.email));
  });
});

test('can sign up', async () => {
  const { user } = await signUp(
    {
      userAgent: 'chrome',
      email: 'test@test.ru',
      login: 'login',
      password: 'password',
    },
    Mock.context,
  );

  expect(user.login).toBe('login');
});

test('activation letter has been send', async () => {
  await signUp(
    {
      userAgent: 'chrome',
      email: 'test@test.ru',
      login: 'login',
      password: 'password',
    },
    Mock.context,
  );

  expect((Mock.context.service.mail.sendUserActivationMail as jest.Mock).mock.calls.length).toBe(1);
});
