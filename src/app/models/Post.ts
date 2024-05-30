import { User } from './User';

export interface Post {
  id: string;
  userId: string;
  description?: string;
  postAttachments: PostAttachment[];
  dateCreated: Date;
  user?: User;
}

export interface PostAttachment {
  postId: string;
  url: string;
  name: string;
  contentType: string;
}

export interface PostForCreation {
  description?: string;
  files: File[];
}
