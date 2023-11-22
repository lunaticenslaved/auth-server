import { Errors } from '@lunaticenslaved/schema';

export function createUserWithLoginExistsError(login: string) {
  return new Errors.ConflictError({
    messages: [`User with the login '${login}' already exists`],
    status: 403,
  });
}

export function createUserWithEmailExistsError(email: string) {
  return new Errors.ConflictError({
    messages: [`User with the email '${email}' already exists`],
    status: 403,
  });
}
