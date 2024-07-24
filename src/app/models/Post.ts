import { User } from './User';

export interface Post {
  id: string;
  userId: string;
  description?: string;
  postAttachments: PostAttachment[];
  liked: boolean;
  dateCreated: Date;
  user?: User;
}

export interface PostAttachment {
  postId: string;
  url: string;
  name: string;
  contentType: string;
  createdDate: Date;
}

export interface PostForCreation {
  description?: string;
  files: File[];
}
