import { Injectable, signal } from '@angular/core';
import { Post, PostForCreation } from '../models/Post';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommentForCreation } from '../models/Comment';
import { Comment } from '../models/Comment';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly API = `${environment.api}/Posts`;
  posts = signal<Post[]>([]);

  constructor(private http: HttpClient) {}

  getAll(me = false, following = false) {
    return this.http.get<Post[]>(`${this.API}?me=${me}&following=${following}`);
  }

  getById(id: string) {
    return this.http.get<Post>(`${this.API}/${id}`);
  }

  getComments(id: string) {
    return this.http.get<Comment[]>(`${this.API}/${id}/comments`);
  }

  post(data: PostForCreation) {
    const formData = new FormData();
    if (data.description) {
      formData.set('Description', data.description);
    }
    for (let index = 0; index < data.files.length; index++) {
      const file = data.files[index];
      formData.append('Files', file);
    }
    return this.http.post<Post>(this.API, formData);
  }

  update(id: string, description: string) {
    return this.http.put<void>(`${this.API}/${id}`, { description });
  }

  addComment(id: string, comment: CommentForCreation) {
    return this.http.post<Comment>(`${this.API}/${id}/comments`, comment);
  }

  addOrRemoveLike(id: string) {
    return this.http.patch<void>(`${this.API}/${id}/likes`, {});
  }
}
