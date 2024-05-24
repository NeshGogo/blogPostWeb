import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Token } from '../models/Token';
import { User } from '../models/User';
import { TokenService } from './token.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  API = `${environment.api}/accounts`;
  user = signal<User | null>(null);

  constructor(private http: HttpClient, private tokenService: TokenService) {
    this.loadUser();
  }

  login(email: string, password: string) {
    const body = {
      email,
      password,
    };
    return this.http.post<Token>(this.API, body).pipe(
      tap((resp) => {
        this.tokenService.set(
          resp.token as string,
          resp.refreshToken as string
        );
        this.user.set(this.tokenService.decodeToken() as any);
      })
    );
  }

  logout() {
    this.tokenService.remove();
    this.tokenService.removeRefreshToken();
    this.user.set(null);
  }

  private loadUser() {
    const token = this.tokenService.get();
    if (!token?.token) return;
    this.user.set(this.tokenService.decodeToken() as any);
  }
}
