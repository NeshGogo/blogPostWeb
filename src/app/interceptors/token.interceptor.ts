import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  let tokenModel = tokenService.get();

  if (tokenModel?.token) {
    req = req.clone({
      headers: req.headers.set('authorization', `bearer ${tokenModel?.token}`),
    });
  }

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401 && tokenModel?.token && tokenService.isTokenExpired()) {
        return tokenService.refreshToken().pipe(
          switchMap((newtoken) => {
            req = req.clone({
              headers: req.headers.set(
                'authorization',
                `bearer ${newtoken?.token}`
              ),
            });
            return next(req);
          }),
          catchError((err) => {
            tokenService.remove();
            router.navigate(['/auth/login']);
            return throwError(() => err);
          })
        )
      }
      return throwError(() => err);
    })
  );
};
