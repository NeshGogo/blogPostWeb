import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { User } from '../models/User';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['user']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    authServiceMock = TestBed.inject(
      AuthService
    ) as jasmine.SpyObj<AuthService>;
    routerMock = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if user is authenticated', () => {
    var user: User = {
      id: '12341',
      name: 'test',
      email: 'test@test.com',
      userName: 'test',
    };

    authServiceMock.user.and.returnValue(user);

    const result = TestBed.runInInjectionContext(() =>
      authGuard(null as any, null as any)
    );

    expect(result).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to login if user is not authenticated', () => {
    authServiceMock.user.and.returnValue(null);

    const result = TestBed.runInInjectionContext(() =>
      authGuard(null as any, null as any)
    );

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['auth/login']);
  });
});
