import { Mock } from '#/__mocks__';
import { ValidationError } from '#/errors';

import { updatePassword } from './action';
import { createIncorrectPasswordError, createSamePasswordError } from './errors';

const data = {
  userAgent: 'chrome',
  login: 'login',
  password: 'password',
};

describe('validation works', () => {
  test('oldPassword is not valid', async () => {
    const { user } = await Mock.utils.createUser(data);
    const promise = updatePassword(
      {
        userId: user.id,
        oldPassword: '',
        newPassword: 'new password',
      },
      Mock.context,
    );

    await expect(promise).rejects.toThrow(ValidationError);
  });

  test('newPassword is not valid', async () => {
    const { user } = await Mock.utils.createUser(data);
    const promise = updatePassword(
      {
        userId: user.id,
        oldPassword: data.password,
        newPassword: '',
      },
      Mock.context,
    );

    await expect(promise).rejects.toThrow(ValidationError);
  });
});

describe('cannot update password', () => {
  test('when old password does not match', async () => {
    const { user } = await Mock.utils.createUser(data);
    const promise = updatePassword(
      {
        userId: user.id,
        oldPassword: data.password + ' invalid',
        newPassword: 'new password',
      },
      Mock.context,
    );

    await expect(promise).rejects.toThrow(createIncorrectPasswordError());
  });

  test('when new password is the same', async () => {
    const { user } = await Mock.utils.createUser(data);
    const promise = updatePassword(
      {
        userId: user.id,
        oldPassword: data.password,
        newPassword: data.password,
      },
      Mock.context,
    );

    await expect(promise).rejects.toThrow(createSamePasswordError());
  });
});
