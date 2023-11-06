import { UserDTO } from '@/dto';

export type UpdateInfoRequest = {
  login: string;
};

export type UpdateInfoResponse = {
  user: UserDTO.User;
};
