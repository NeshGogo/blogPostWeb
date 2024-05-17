import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Token } from '../models/Token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API = `${environment.api}/accounts`;

  constructor(private http: HttpClient) { }

  login(email:string, password:string) {
    const body = {
      email,
      password,
    }
    return this.http.post<Token>(this.API, body);
  }
}
