import { User } from '@/models/user';

export type UpdateInfoRequest = {
  login: string;
};

export type UpdateInfoResponse = {
  user: User;
};
