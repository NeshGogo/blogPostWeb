import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserFollowing } from '../models/UserFollowing';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private readonly API = `${environment.api}/Follows`;

  constructor(private http: HttpClient) {}

  getFollowing(following = true) {
    return this.http.get<UserFollowing[]>(`${this.API}/following?following=${following}`);
  }

  addFollowing(userId: string){
    return this.http.post<UserFollowing>(`${this.API}/following`, {followingUserId: userId});
  }

  removeFollowing(userId: string){
    return this.http.delete<void>(`${this.API}/unfollow/${userId}`);
  }
}
