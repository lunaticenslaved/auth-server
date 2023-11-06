import { UserDTO } from '@/dto';

export type UpdatePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export type UpdatePasswordResponse = {
  user: UserDTO.User;
};
