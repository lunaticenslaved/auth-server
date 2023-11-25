import { User } from '#/models';

export type UpdatePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export type UpdatePasswordResponse = {
  user: User;
};
