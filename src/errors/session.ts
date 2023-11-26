import { Errors } from '@lunaticenslaved/schema';

export function createSessionNotFoundError() {
  return new Errors.NotFoundError({ messages: 'Session not found' });
}
