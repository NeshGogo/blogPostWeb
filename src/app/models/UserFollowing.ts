import { User } from "./User";

export interface UserFollowing {
  userId: string;
  followingUserId: string;
  createdDate: Date;
  followingUser: User;
}