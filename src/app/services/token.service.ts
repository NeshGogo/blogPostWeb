import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Token } from '../models/Token';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly tokenName = 'token';
  private readonly refreshTokenName = 'refresh_token';
  private readonly API = `${environment.api}/token`;

  constructor(private http: HttpClient) {}

  set(token: string, refreshToken: string) {
    localStorage.setItem(this.tokenName, token);
    localStorage.setItem(this.refreshTokenName, refreshToken);
  }

  setRefreshToken(refreshToken: string) {
    localStorage.setItem(this.tokenName, refreshToken);
  }

  decodeToken() {
    const tokenComp = this.get();
    return tokenComp?.token ? jwtDecode(tokenComp.token) : null;
  }

  get(): Token {
    return {
      token: localStorage.getItem(this.tokenName),
      refreshToken: localStorage.getItem(this.refreshTokenName),
    };
  }

  remove() {
    localStorage.removeItem(this.tokenName);
  }

  removeRefreshToken() {
    localStorage.removeItem(this.refreshTokenName);
  }

  isTokenExpired() {
    const expiryTime = this.decodeToken()?.exp;
    if (expiryTime) {
      const date = new Date(expiryTime * 1000);
      return date < new Date();
    }
    return true;
  }

  refreshToken() {
    return this.http.post<Token>(`${this.API}/refresh`, this.get()).pipe(tap((token) => {
      this.set(<string>token.token, <string>token.refreshToken);
    }));
  }
}
