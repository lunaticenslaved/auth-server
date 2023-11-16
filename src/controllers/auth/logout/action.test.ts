import { Mock } from '#/__mocks__';
import { TokensUtils } from '#/utils';

import { logout } from './action';

test('session was deleted', async () => {
  const data = {
    userAgent: 'chrome',
    login: 'login',
    password: 'password',
  };

  const { accessToken } = await Mock.utils.createUser(data);
  const { sessionId } = TokensUtils.getTokenData({ accessToken }, 'strict');

  async function getSession() {
    return (
      (await Mock.context.prisma.session.findFirst({
        where: { id: sessionId },
      })) || undefined
    );
  }

  const session = await getSession();

  expect(session).toBeDefined();

  await logout({ sessionId: session!.id }, Mock.context);

  expect(await getSession()).toBeUndefined();
});
