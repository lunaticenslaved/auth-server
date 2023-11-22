import { Context } from '#/context';

type Request = {
  sessionId: string;
};

export async function logout({ sessionId }: Request, context: Context) {
  await context.service.session.delete({ sessionId });
}
