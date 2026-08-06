# Testing Services

This guide covers patterns for testing Angular services, focusing on the dependency strategy, HTTP testing, and punctual spy usage.

## When to Use

- Creating or updating `*.service.spec.ts` files.
- Testing services that inject other services.
- Testing services that make HTTP requests.
- Testing signal-based state services (stores).

## Dependency Strategy

Follow the **dependency pyramid** from [testing-conventions.md](testing-conventions.md):

```
┌─────────────────────────────────────────────────────┐
│  ALWAYS REAL: Signal stores, state services         │
│  (no I/O, no external side effects)                 │
├─────────────────────────────────────────────────────┤
│  REAL + HTTP INTERCEPTED:                           │
│  Services with HTTP calls                           │
│  (real logic, controlled I/O)                       │
├─────────────────────────────────────────────────────┤
│  STUB ACCEPTABLE: Router, Window, localStorage,     │
│  third-party SDKs (platform infrastructure)         │
└─────────────────────────────────────────────────────┘
```

## Testing State Services (Signal Stores)

State services that manage signals require no TestBed if they have no DI dependencies.

```ts
import { faker } from '@faker-js/faker';
import { MyStore } from './my.store';

describe('MyStore', () => {
  let store: MyStore;

  beforeEach(() => {
    store = new MyStore();
  });

  it('should initialize with default state', () => {
    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
  });

  it('should add item to the list', () => {
    const item = generateItem();

    store.addItem(item);

    expect(store.items()).toContain(item);
  });

  it('should reset state to defaults', () => {
    store.addItem(generateItem());
    store.addItem(generateItem());

    store.reset();

    expect(store.items()).toEqual([]);
  });
});
```

## Testing Services with DI (no HTTP)

When a service uses `inject()` for dependencies, use TestBed but keep dependencies real.

```ts
import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { CartStore } from '../stores/cart.store';

describe('OrderService', () => {
  let service: OrderService;
  let cartStore: CartStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderService);
    cartStore = TestBed.inject(CartStore);
  });

  it('should calculate order total from cart items', () => {
    const item = generateCartItem({ price: 50, quantity: 2 });
    cartStore.addItem(item);

    const total = service.calculateTotal();

    expect(total).toBe(100);
  });

  it('should clear cart after order is placed', () => {
    cartStore.addItem(generateCartItem());

    service.placeOrder();

    expect(cartStore.items()).toEqual([]);
  });
});
```

## Testing Services with HTTP

Use the **real service** with `provideHttpClientTesting()` to intercept and control HTTP requests.

```ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { faker } from '@faker-js/faker';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensure no outstanding requests
  });

  it('should fetch users from API', (done) => {
    const expectedUsers = [generateUser(), generateUser()];

    service.getUsers().subscribe((users) => {
      expect(users).toEqual(expectedUsers);
      done();
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(expectedUsers);
  });

  it('should send POST with correct body', (done) => {
    const newUser = generateUser();

    service.createUser(newUser).subscribe((result) => {
      expect(result.id).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush({ ...newUser, id: faker.string.uuid() });
  });

  it('should handle 500 error gracefully', (done) => {
    service.getUsers().subscribe({
      error: (err) => {
        expect(err.status).toBe(500);
        done();
      },
    });

    const req = httpMock.expectOne('/api/users');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
```

## Punctual Spies for Interaction Verification

When you need to verify a method was called without replacing its behavior permanently:

```ts
describe('NotificationService', () => {
  let service: NotificationService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NotificationService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  it('should track notification sent event', () => {
    const spy = jest.spyOn(analyticsService, 'track'); // adapte ao runner do projeto
    const notification = generateNotification();

    service.send(notification);

    expect(spy).toHaveBeenCalledWith('notification_sent', { type: notification.type });
  });

  it('should still process notification normally without spy', () => {
    const notification = generateNotification();

    service.send(notification);

    // Real analyticsService.track() ran here — no spy interference
    expect(service.sentCount()).toBe(1);
  });
});
```

## Testing Services with InjectionToken Dependencies

```ts
import { InjectionToken } from '@angular/core';

const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

describe('ApiService', () => {
  let service: ApiService;
  const baseUrl = faker.internet.url();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: API_BASE_URL, useValue: baseUrl },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ApiService);
  });

  it('should prepend base URL to requests', (done) => {
    const httpMock = TestBed.inject(HttpTestingController);

    service.get('/users').subscribe(() => done());

    httpMock.expectOne(`${baseUrl}/users`).flush([]);
  });
});
```

## Quality Checklist

- State services tested without TestBed when possible (no DI dependencies).
- HTTP services use real service + `HttpTestingController`, not stubs.
- `httpMock.verify()` called in `afterEach` for HTTP tests.
- Spies created inside `it()` blocks, not in `beforeEach`.
- InjectionTokens provided with `useValue` in TestBed.
- Request method (GET/POST/PUT/DELETE) verified in HTTP tests.
- Both success and error HTTP responses tested.
- No global service stubs unless the dependency is platform infrastructure.
