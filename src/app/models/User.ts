export interface User {
  id: string;
  name: string;
  email: string;
  userName: string;
  bio?: string;
  userImageUrl?: string;
}

export interface UserForCreation{
  name: string;
  email: string;
  userName: string;
  password: string;
}