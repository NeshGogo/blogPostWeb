import { ModelBase } from "./ModelBase";
import { User } from "./User";

export interface Comment extends ModelBase{
  userId: string;
  postId: string;
  content: string;
  user?:User
}

export interface CommentForCreation{
  content: string;
}
