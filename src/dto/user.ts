type Avatar = {
  id: string;
  link: string;
};

export type User = {
  id: string;
  login: string;
  email: string;
  isActivated: boolean;
  avatar: Avatar | null;
};
