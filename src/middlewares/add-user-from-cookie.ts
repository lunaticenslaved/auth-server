import { NextFunction, Request, Response } from 'express';

import { context } from '@/context';

export async function addUserFromCookie(request: Request, _: Response, next: NextFunction) {
  const { cookies } = request;
  const accessToken = cookies['accessToken'];

  try {
    const user = await context.prisma.user.findFirst({
      where: {
        sessions: {
          some: { accessToken: { equals: accessToken } },
        },
      },
    });

    if (user) {
      const { password: _password, ...userData } = user;
      request.user = userData || undefined;
    }
  } catch (error) {
    console.log('Cannot get user from token');
  }

  next();
}
