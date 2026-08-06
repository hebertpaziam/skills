# Testing Signals

This guide covers patterns for testing Angular's reactive primitives: `signal`, `computed`, `effect`, `linkedSignal`, and `resource`.

## When to Use

- Testing components or services that use signals for state management.
- Verifying computed derivations update correctly.
- Testing side effects triggered by `effect()`.
- Testing `linkedSignal` reset/override behavior.
- Testing async data fetching with `resource()`.

## Testing `signal` and `computed`

Signals and computed values are synchronous. Read them by calling as functions.

```ts
import { signal, computed } from '@angular/core';

describe('CartStore', () => {
  let items: WritableSignal<CartItem[]>;
  let totalPrice: Signal<number>;

  beforeEach(() => {
    items = signal([]);
    totalPrice = computed(() => items().reduce((sum, i) => sum + i.price, 0));
  });

  it('should compute total price from items', () => {
    const item1 = generateCartItem({ price: 10 });
    const item2 = generateCartItem({ price: 25 });

    items.set([item1, item2]);

    const result = totalPrice();
    expect(result).toBe(35);
  });

  it('should return zero when cart is empty', () => {
    items.set([]);

    const result = totalPrice();
    expect(result).toBe(0);
  });
});
```

### Key Points

- `computed` updates **synchronously** when source signals change.
- No need for `await` or `whenStable()` when testing pure signal logic without a component.
- Always read the signal (`signal()`) AFTER setting the source to capture the updated value.

## Testing `effect`

Effects run asynchronously in a reactive context. They require `TestBed` to provide an injection context.

```ts
import { TestBed } from '@angular/core/testing';
import { signal, effect } from '@angular/core';

describe('LoggingEffect', () => {
  it('should call logger when value changes', async () => {
    const value = signal('initial');
    const logger = jest.fn(); // adapte ao runner do projeto

    TestBed.runInInjectionContext(() => {
      effect(() => {
        logger(value());
      });
    });

    // Effect runs once on creation
    await TestBed.inject(ApplicationRef).whenStable();
    expect(logger).toHaveBeenCalledWith('initial');

    // Change the signal
    value.set('updated');
    await TestBed.inject(ApplicationRef).whenStable();
    expect(logger).toHaveBeenCalledWith('updated');
  });
});
```

### Key Points

- Effects need an **injection context** — use `TestBed.runInInjectionContext()`.
- Effects are **asynchronous** — use `await applicationRef.whenStable()` or `fixture.whenStable()` to flush them.
- Test the **side effect** (what the effect does), not the effect itself.

## Testing `linkedSignal`

`linkedSignal` creates a writable signal that resets when its source changes.

```ts
import { signal, linkedSignal } from '@angular/core';

describe('PaginationStore', () => {
  it('should reset page to 1 when filter changes', () => {
    const filter = signal('all');
    const page = linkedSignal(() => ({ source: filter(), initialValue: 1 }));

    // User navigates to page 3
    page.set(3);
    expect(page()).toBe(3);

    // Filter changes → page resets
    filter.set('active');
    expect(page()).toBe(1);
  });

  it('should allow manual override after reset', () => {
    const filter = signal('all');
    const page = linkedSignal(() => ({ source: filter(), initialValue: 1 }));

    filter.set('active');
    expect(page()).toBe(1);

    page.set(5);
    expect(page()).toBe(5);
  });
});
```

### Key Points

- `linkedSignal` is **synchronous** — no async needed.
- Test both: the **reset behavior** when source changes AND the **override behavior** after reset.
- Verify the initial value on creation.

## Testing `resource`

`resource()` handles async data fetching tied to signal state. It requires more setup.

```ts
import { TestBed } from '@angular/core/testing';
import { signal, resource } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('UserResource', () => {
  let httpMock: HttpTestingController;
  let userId: WritableSignal<string>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    userId = signal('user-1');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch user data when userId changes', async () => {
    const expectedUser = generateUser({ id: 'user-1' });

    let userResource: any;
    TestBed.runInInjectionContext(() => {
      userResource = resource({
        request: () => userId(),
        loader: async ({ request }) => {
          const response = await fetch(`/api/users/${request}`);
          return response.json();
        },
      });
    });

    // Flush the HTTP request
    const req = httpMock.expectOne('/api/users/user-1');
    req.flush(expectedUser);

    await TestBed.inject(ApplicationRef).whenStable();

    expect(userResource.value()).toEqual(expectedUser);
    expect(userResource.status()).toBe('resolved');
  });

  it('should reflect loading state', () => {
    TestBed.runInInjectionContext(() => {
      const userResource = resource({
        request: () => userId(),
        loader: async ({ request }) => {
          const response = await fetch(`/api/users/${request}`);
          return response.json();
        },
      });

      expect(userResource.status()).toBe('loading');
    });
  });
});
```

### Key Points

- `resource` needs an **injection context**.
- Test the **status transitions**: `idle` → `loading` → `resolved` / `error`.
- Use `HttpTestingController` to control when the response arrives.
- Test **re-fetch** behavior: change the request signal and verify a new request is made.
- Always `httpMock.verify()` in `afterEach`.

## Testing Signals in Components

When signals are part of a component, use the standard component test setup:

```ts
describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
  });

  it('should increment count', () => {
    const initialCount = component.count();

    component.increment();

    expect(component.count()).toBe(initialCount + 1);
  });

  it('should compute doubled value', () => {
    component.count.set(5);

    const result = component.doubled();
    expect(result).toBe(10);
  });
});
```

## Quality Checklist

- Signal reads happen AFTER state mutations.
- `computed` tested synchronously (no unnecessary async).
- `effect` tested via its side effects, not the effect reference itself.
- `linkedSignal` tests cover both reset and override scenarios.
- `resource` tests cover loading, resolved, and error states.
- Injection context provided via `TestBed.runInInjectionContext()` when needed.
- No reliance on test execution order for signal state.
