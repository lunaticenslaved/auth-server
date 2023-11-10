import { UploadedFile } from 'express-fileupload';

import { Mock } from '#/__mocks__';

import { updateAvatar } from './action';

test('can upload file', async () => {
  const { user } = await Mock.utils.createUser({
    login: 'login',
    password: 'password',
    userAgent: 'chrome',
  });

  await updateAvatar(
    {
      userId: user.id,
      avatar: { name: 'avatar' } as UploadedFile,
    },
    Mock.context,
  );
});
