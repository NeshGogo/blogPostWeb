import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const tokenModel = tokenService.get();
  if (tokenModel?.token){
    req = req.clone({
      headers: req.headers.set('authorization', `bearer ${tokenModel?.token}`),
    });
  }
  return next(req);
};
