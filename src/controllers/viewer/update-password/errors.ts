import { Errors } from '@lunaticenslaved/schema';

export function createIncorrectPasswordError() {
  return new Errors.ValidationError({ messages: [`Password is incorrect`] });
}

export function createSamePasswordError() {
  return new Errors.ValidationError({
    messages: ['New password cannot be the same'],
  });
}
