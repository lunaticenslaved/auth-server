import { Errors } from '@lunaticenslaved/schema';

export function createUserWithLoginNotExistsError(login: string) {
  return new Errors.NotFoundError({
    messages: [`User with the login '${login}' not found`],
    status: 404,
  });
}

export function createInvalidPasswordError() {
  return new Errors.ValidationError({
    messages: [`Invalid login or password`],
  });
}
