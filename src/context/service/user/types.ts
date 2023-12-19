import { Service } from '@lunaticenslaved/schema/models';

import { User } from '#/models';

export type CreateUserResponse = User;
export interface CreateUserRequest {
  login: string;
  email: string;
  password: string;
}

export type GetUserResponse = User;
export type GetUserRequest = { userId: string } | { login: string } | { email: string };

export type UpdateUserResponse = User;
export interface UpdateUserRequest {
  userId: string;
  login?: string;
  uploadedAvatar?: string;
  password?: string;
}

export type ActivateUserResponse = User;
export interface ActivateUserRequest {
  userId: string;
}

export type ListUsersResponse = User[];
export interface ListUsersRequest {
  userIds?: string[];
  search?: string;
  take?: number;
  services?: Service[];
  excludeIds?: string[];
}

export type SearchUsersResponse = User[];
export interface SearchUsersRequest {
  search: string;
  take?: number;
}

export type AddInServiceRequest = {
  userId: string;
  service: Service;
};
