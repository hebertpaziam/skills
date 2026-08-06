# Testing Guards, Pipes, and Interceptors

This guide covers patterns for testing Angular functional guards, pipes, and HTTP interceptors in isolation.

## When to Use

- Creating or updating `*.guard.spec.ts`, `*.pipe.spec.ts`, or `*.interceptor.spec.ts` files.
- Testing functional guards that use `inject()` and signal-based state.
- Testing pipes as pure transformations or with DI dependencies.
- Testing HTTP interceptors that modify requests or handle errors.

## Testing Functional Guards

Functional guards are plain functions that run in an injection context. Use `TestBed.runInInjectionContext()` to test them.

### Route Guard with Signal-based State

```ts
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { faker } from '@faker-js/faker';
import { authGuard } from './auth.guard';
import { AuthStore } from '../stores/auth.store';

describe('authGuard', () => {
  let authStore: AuthStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { navigate: jest.fn() } }, // adapte ao runner do projeto
      ],
    });
    authStore = TestBed.inject(AuthStore);
    router = TestBed.inject(Router);
  });

  it('should allow access when user is authenticated', () => {
    authStore.setAuthenticated(true);

    const result = TestBed.runInInjectionContext(() => authGuard());

    expect(result).toBe(true);
  });

  it('should redirect to login when user is not authenticated', () => {
    authStore.setAuthenticated(false);

    const result = TestBed.runInInjectionContext(() => authGuard());

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
```

### Guard with ActivatedRouteSnapshot

```ts
import { ActivatedRouteSnapshot } from '@angular/router';

describe('roleGuard', () => {
  it('should allow access when user has required role', () => {
    const route = { data: { requiredRole: 'admin' } } as unknown as ActivatedRouteSnapshot;
    const authStore = TestBed.inject(AuthStore);
    authStore.setRole('admin');

    const result = TestBed.runInInjectionContext(() => roleGuard(route));

    expect(result).toBe(true);
  });

  it('should deny access when user lacks required role', () => {
    const route = { data: { requiredRole: 'admin' } } as unknown as ActivatedRouteSnapshot;
    const authStore = TestBed.inject(AuthStore);
    authStore.setRole('viewer');

    const result = TestBed.runInInjectionContext(() => roleGuard(route));

    expect(result).toBe(false);
  });
});
```

### Guard that Returns Observable

```ts
import { firstValueFrom } from 'rxjs';

describe('asyncGuard', () => {
  it('should resolve to true when permission is granted', async () => {
    const permissionService = TestBed.inject(PermissionService);
    // Setup: ensure permission is granted in the real service state

    const result$ = TestBed.runInInjectionContext(() => asyncGuard());
    const result = await firstValueFrom(result$);

    expect(result).toBe(true);
  });
});
```

## Testing Pipes

Pipes are pure transformations. Test them as plain classes — no TestBed needed.

### Pure Pipe (no dependencies)

```ts
import { faker } from '@faker-js/faker';
import { CurrencyBrlPipe } from './currency-brl.pipe';

describe('CurrencyBrlPipe', () => {
  let pipe: CurrencyBrlPipe;

  beforeEach(() => {
    pipe = new CurrencyBrlPipe();
  });

  it('should format number as BRL currency', () => {
    const input = 1234.56;

    const result = pipe.transform(input);

    expect(result).toBe('R$ 1.234,56');
  });

  it('should return empty string when value is null', () => {
    const result = pipe.transform(null);

    expect(result).toBe('');
  });

  it('should handle zero correctly', () => {
    const result = pipe.transform(0);

    expect(result).toBe('R$ 0,00');
  });

  it('should format negative values', () => {
    const input = -500.99;

    const result = pipe.transform(input);

    expect(result).toBe('-R$ 500,99');
  });
});
```

### Pipe with Dependencies (inject)

```ts
import { TestBed } from '@angular/core/testing';
import { TranslatePipe } from './translate.pipe';
import { TranslationService } from '../services/translation.service';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    pipe = TestBed.runInInjectionContext(() => new TranslatePipe());
  });

  it('should translate key using translation service', () => {
    const result = pipe.transform('greeting.hello');

    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});
```

## Testing HTTP Interceptors

Functional interceptors are tested by executing a real HTTP call through `HttpClient` with the interceptor registered.

### Auth Token Interceptor

```ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { AuthStore } from '../stores/auth.store';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authStore: AuthStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authStore = TestBed.inject(AuthStore);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header when token exists', () => {
    const token = faker.string.alphanumeric(32);
    authStore.setToken(token);

    httpClient.get('/api/data').subscribe();

    const req = httpMock.expectOne('/api/data');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush({});
  });

  it('should not add Authorization header when no token', () => {
    authStore.setToken(null);

    httpClient.get('/api/data').subscribe();

    const req = httpMock.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
```

### Error Handling Interceptor

```ts
describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retry once on 500 error then propagate', (done) => {
    httpClient.get('/api/data').subscribe({
      error: (err) => {
        expect(err.status).toBe(500);
        done();
      },
    });

    // First attempt
    httpMock.expectOne('/api/data').flush(null, { status: 500, statusText: 'Error' });
    // Retry attempt
    httpMock.expectOne('/api/data').flush(null, { status: 500, statusText: 'Error' });
  });

  it('should pass through successful responses', (done) => {
    const expectedData = { id: faker.string.uuid() };

    httpClient.get('/api/data').subscribe((data) => {
      expect(data).toEqual(expectedData);
      done();
    });

    httpMock.expectOne('/api/data').flush(expectedData);
  });
});
```

## Quality Checklist

- Guards tested with `TestBed.runInInjectionContext()`.
- Router stubbed with `useValue` in guard tests (platform infrastructure).
- State services kept real in guard tests for signal-based decisions.
- Pipes without DI tested with plain `new Pipe()`.
- Pipes with DI tested via `TestBed.runInInjectionContext()`.
- Interceptors tested by making real `HttpClient` calls with `withInterceptors([...])`.
- Interceptor tests verify request headers, body modifications, and error handling.
- `httpMock.verify()` in `afterEach` for interceptor tests.
- All edge cases covered: null inputs, missing tokens, error responses.
