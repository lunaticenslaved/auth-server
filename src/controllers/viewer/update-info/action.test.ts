import { Mock } from '#/__mocks__';
import { ValidationError } from '#/errors';

import { updateInfo } from './action';

test('login is required', async () => {
  const { user } = await Mock.utils.createUser({
    userAgent: 'chrome',
    login: 'login',
    password: 'password',
  });

  const promise = updateInfo(
    {
      userId: user.id,
      login: '',
    },
    Mock.context,
  );

  await expect(promise).rejects.toThrow(ValidationError);
});

test('can change login', async () => {
  const { user } = await Mock.utils.createUser({
    userAgent: 'chrome',
    login: 'login',
    password: 'password',
  });

  const { user: newUser } = await updateInfo(
    {
      userId: user.id,
      login: 'new login',
    },
    Mock.context,
  );

  expect(newUser.login).toEqual('new login');
});
