import { Context } from '#/context';

type Request = {
  sessionId: string;
};

export async function logout({ sessionId }: Request, context: Context) {
  await context.services.session.delete({ sessionId });
}
