import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API = `${environment.api}/accounts/users`;

  constructor(private http: HttpClient) {}

  getUsers(val: string | null = null) {
    return this.http.get<User[]>(`${this.API}${val ? '?search=' + val : ''}`);
  }

  getUserById(id: string) {
    return this.http.get<User>(`${this.API}/${id}`);
  }
}
