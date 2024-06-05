import { Injectable } from '@angular/core';
import { Post, PostForCreation } from '../models/Post';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly API = `${environment.api}/Posts`;

  constructor(private http: HttpClient) {}

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
}
