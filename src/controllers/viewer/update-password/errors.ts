import { Error } from '@lunaticenslaved/schema';

export function createIncorrectPasswordError() {
  return new Error.ValidationError({ messages: [`Password is incorrect`] });
}

export function createSamePasswordError() {
  return new Error.ValidationError({
    messages: ['New password cannot be the same'],
  });
}
