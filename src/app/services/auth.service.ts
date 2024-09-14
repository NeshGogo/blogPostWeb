import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Token } from '../models/Token';
import { User, UserForCreation } from '../models/User';
import { TokenService } from './token.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API = `${environment.api}/accounts`;
  user = signal<User | null>(null);

  constructor(private http: HttpClient, private tokenService: TokenService) {
    this.loadUser();
  }

  login(email: string, password: string) {
    const body = {
      email,
      password,
    };
    return this.http.post<Token>(`${this.API}/login`, body).pipe(
      tap((resp) => {
        this.tokenService.set(
          resp.token as string,
          resp.refreshToken as string
        );
        this.loadUser();
      })
    );
  }

  signup(user: UserForCreation) {
    return this.http.post<User>(`${this.API}/register`, user);
  }

  logout() {
    this.tokenService.remove();
    this.tokenService.removeRefreshToken();
    this.user.set(null);
  }

  private loadUser() {
    const token = this.tokenService.get();
    if (!token?.token) return;
    const decoded = this.tokenService.decodeToken() as any;
    const user: User = 
    {
      userName: decoded.UserName,
      name: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email'],
      id: decoded.Id
    }
    this.user.set(user);
  }
}
