import { Errors } from '@lunaticenslaved/schema';

export function createUserNotFoundError() {
  return new Errors.UnauthorizedError({ messages: 'User not found' });
}
