import { Mock } from '#/__mocks__';

import { signUp } from '../sign-up/sign-up';
import { logout } from './action';

test('session was deleted', async () => {
  const data = {
    userAgent: 'chrome',
    login: 'login',
    password: 'password',
  };

  const { user, accessToken } = await signUp(data, Mock.context);

  async function getSession() {
    return (
      (await Mock.context.prisma.session.findFirst({
        where: {
          userId: { equals: user.id },
          accessToken: { equals: accessToken },
        },
      })) || undefined
    );
  }

  expect(await getSession()).toBeDefined();

  await logout({ accessToken, userId: user.id }, Mock.context);

  expect(await getSession()).toBeUndefined();
});
