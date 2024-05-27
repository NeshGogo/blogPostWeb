import { TestBed } from '@angular/core/testing';
import { HttpEvent, HttpHandler, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

import { tokenInterceptor } from './token.interceptor';
import { TokenService } from '../services/token.service';
import { Token } from '../models/Token';
import { of } from 'rxjs';

describe('tokenInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => tokenInterceptor(req, next));
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TokenService,
      ],
    });
    tokenService = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add authorization header if token is present', () => {
    const tokenModel: Token = { token: 'fake-token', refreshToken: 'fake-refresh-token' };
    spyOn(tokenService, 'get').and.returnValue(tokenModel);

    const req = new HttpRequest('GET', '/test');
    const next = jasmine.createSpy('next').and.callFake((req: HttpRequest<any>) => of({} as HttpEvent<any>));

    const result = TestBed.runInInjectionContext(() => tokenInterceptor(req, next))

    result.subscribe(() => {
      const interceptedReq = next.calls.mostRecent().args[0];
      expect(interceptedReq.headers.get('authorization')).toBe('bearer fake-token');
    });
  });

  it('should not add authorization header if token is not present', () => {
    spyOn(tokenService, 'get').and.returnValue({token: null, refreshToken: null});

    const req = new HttpRequest('GET', '/test');
    const next = jasmine.createSpy('next').and.callFake((req: HttpRequest<any>) => of({} as HttpEvent<any>));
    const result  = TestBed.runInInjectionContext(() => tokenInterceptor(req, next))

    result.subscribe(() => {
      const interceptedReq = next.calls.mostRecent().args[0];
      expect(interceptedReq.headers.has('authorization')).toBeFalse();
    });
  });
});
