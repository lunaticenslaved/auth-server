import { AuthenticationError, ValidationError } from '#/errors';

export function createIncorrectPasswordError() {
  return new AuthenticationError({ errors: [`Password is incorrect`] });
}

export function createSamePasswordError() {
  return new ValidationError({ errors: ['New password cannot be the same'] });
}
