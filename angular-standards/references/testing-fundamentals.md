# Testing Fundamentals

This guide covers the fundamental principles and practices for writing unit tests in Angular projects.

## Core Philosophy: Zoneless & Async-First

Modern Angular projects follow a zoneless testing approach. State changes schedule updates asynchronously, and tests must account for this.

**Do NOT** use `fixture.detectChanges()` to manually trigger updates.
**ALWAYS** use the "Act, Wait, Assert" pattern:

1.  **Act:** Update state or perform an action (e.g., set a component input, click a button).
2.  **Wait:** Use `await fixture.whenStable()` to allow the framework to process the scheduled update and render the changes.
3.  **Assert:** Verify the outcome.

### Basic Test Structure Example

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  it('should display the default title', async () => {
    // ACT: (Implicit) Component is created with default state.
    // WAIT for initial data binding.
    await fixture.whenStable();
    // ASSERT the initial state.
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Default Title');
  });

  it('should display a different title after a change', async () => {
    // ACT: Change the component's title property.
    component.title.set('New Test Title');

    // WAIT for the asynchronous update to complete.
    await fixture.whenStable();

    // ASSERT the DOM has been updated.
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('New Test Title');
  });
});
```

## TestBed and ComponentFixture

- **`TestBed`**: The primary utility for creating a test-specific Angular module. Use `TestBed.configureTestingModule({...})` in your `beforeEach` to declare components, provide services, and set up imports needed for your test.
- **`ComponentFixture`**: A handle on the created component instance and its environment.
  - `fixture.componentInstance`: Access the component's class instance.
  - `fixture.nativeElement`: Access the component's root DOM element.
  - `fixture.debugElement`: An Angular-specific wrapper around the `nativeElement` that provides safer, platform-agnostic ways to query the DOM (e.g., `debugElement.query(By.css('p'))`).

## Async Patterns

### `fixture.whenStable()` (preferred for zoneless)

Use when state changes are signal-based and updates are scheduled asynchronously.

```ts
it('should reflect signal change', async () => {
  component.name.set('Alice');
  await fixture.whenStable();
  expect(fixture.nativeElement.textContent).toContain('Alice');
});
```

### `fakeAsync` / `tick` (for timer-based logic)

Use when testing code that relies on `setTimeout`, `setInterval`, `debounceTime`, or similar time-based operations.

```ts
import { fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';

it('should debounce search input', fakeAsync(() => {
  component.searchControl.setValue('angular');
  tick(300); // advance past debounce time
  expect(component.searchResults().length).toBeGreaterThan(0);
  discardPeriodicTasks(); // cleanup any remaining timers
}));
```

### Observable testing with `done` callback

Use when testing Observable emissions directly.

```ts
it('should emit the transformed value', (done) => {
  service.getData().subscribe((result) => {
    expect(result).toEqual(expectedValue);
    done();
  });
});
```

### Observable testing with `firstValueFrom`

Prefer when you only need the first emission.

```ts
import { firstValueFrom } from 'rxjs';

it('should return user data', async () => {
  const result = await firstValueFrom(service.getUser());
  expect(result.name).toBe(expectedName);
});
```

## Error Testing

### Testing thrown errors

```ts
it('should throw when input is null', () => {
  expect(() => service.process(null)).toThrow();
});

it('should throw specific error message', () => {
  expect(() => service.validate(invalidData)).toThrowError('Invalid input');
});
```

### Testing Observable errors

```ts
it('should emit error when request fails', (done) => {
  service.getData().subscribe({
    error: (err) => {
      expect(err.status).toBe(404);
      done();
    },
  });
  httpMock.expectOne('/api/data').flush(null, { status: 404, statusText: 'Not Found' });
});
```

## Cleanup and Teardown

- Use `afterEach` to verify no outstanding HTTP requests: `httpMock.verify()`.
- Use `afterEach` to unsubscribe from Observables if subscribed manually.
- Use `discardPeriodicTasks()` inside `fakeAsync` tests with intervals.
- Signal-based state services should be reset if shared across tests.
