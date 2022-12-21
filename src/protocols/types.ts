export type UserType = {
  id?: number;
  email: string;
  password: string;
};

export type SessionType = {
  id?: number;
  userId: number;
  token: string;
};

export type CredentialType = {
  id?: number;
  title: string;
  url: string;
  username: string;
  password: string;
  userId: number;
};

export type CredentialUpdateType = {
  title?: string;
  url?: string;
  username?: string;
  password?: string;
};

export type NetworkType = {
  id?: number;
  title: string;
  network: string;
  password: string;
  userId: number;
};

export type NetworkUpdateType = {
  title?: string;
  network?: string;
  password?: string;
};

export type ApplicationError = {
  name: string;
  message: string;
  status: number;
};
