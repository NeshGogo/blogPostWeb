import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Token } from '../models/Token';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API = `${environment.api}/accounts`;
  user =  signal<User|null>(null);

  constructor(private http: HttpClient) { }

  login(email:string, password:string) {
    const body = {
      email,
      password,
    }
    return this.http.post<Token>(this.API, body);
  }
}
