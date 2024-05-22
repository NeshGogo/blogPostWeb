import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { Token } from '../models/Token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly tokenName = 'token';
  private readonly refreshTokenName = 'refresh_token';

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

  get() : Token {
    return {
      token: localStorage.getItem(this.tokenName),
      refreshToken: localStorage.getItem(this.refreshTokenName),
    }
  }

  remove() {
    localStorage.removeItem(this.tokenName);
  }

  removeRefreshToken() {
    localStorage.removeItem(this.refreshTokenName);
  }
}
