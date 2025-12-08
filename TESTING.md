# Testing Guide

## Overview

This project uses **Vitest** as the testing framework along with **React Testing Library** for component testing and **MSW (Mock Service Worker)** for API mocking.

## Running Tests

### Basic Commands

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (re-runs on file changes)
pnpm test:watch

# Run tests with UI (opens browser interface)
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage
```

## Test Structure

### 1. Component Tests

Test React components by rendering them and asserting their behavior.

**Example: Testing a Button Component**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@/tests/test-utils'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should handle click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### 2. Hook Tests

Test custom React hooks using `renderHook`.

**Example: Testing a Custom Hook**

```tsx
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCounter } from '@/hooks/use-counter'

describe('useCounter Hook', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter())
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })
})
```

### 3. API Mocking with MSW

Mock API calls to test components that fetch data.

**Example: Mocking an API Endpoint**

```tsx
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

// Define mock handlers
const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
    ])
  }),
  
  http.post('/api/users', async ({ request }) => {
    const newUser = await request.json()
    return HttpResponse.json(
      { id: 3, ...newUser },
      { status: 201 }
    )
  }),
]

// Setup server
const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### 4. Testing Async Components

Test components that load data asynchronously.

**Example: Testing Loading States**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@/tests/test-utils'
import { UserList } from '@/components/user-list'

describe('UserList Component', () => {
  it('should show loading state initially', () => {
    render(<UserList />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should display users after loading', async () => {
    render(<UserList />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  it('should handle errors', async () => {
    // Mock API to return error
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json(
          { message: 'Server error' },
          { status: 500 }
        )
      })
    )

    render(<UserList />)
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
```

## Common Testing Patterns

### 1. Querying Elements

```tsx
// By role (preferred)
screen.getByRole('button', { name: /submit/i })

// By label text
screen.getByLabelText(/username/i)

// By placeholder
screen.getByPlaceholderText(/enter email/i)

// By text content
screen.getByText(/hello world/i)

// By test ID (use sparingly)
screen.getByTestId('custom-element')
```

### 2. User Interactions

```tsx
import { fireEvent } from '@testing-library/react'

// Click
fireEvent.click(button)

// Type text
fireEvent.change(input, { target: { value: 'test@example.com' } })

// Submit form
fireEvent.submit(form)

// For more realistic interactions, use userEvent:
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()
await user.click(button)
await user.type(input, 'test@example.com')
```

### 3. Assertions

```tsx
// Element presence
expect(element).toBeInTheDocument()
expect(element).not.toBeInTheDocument()

// Visibility
expect(element).toBeVisible()
expect(element).not.toBeVisible()

// Disabled state
expect(button).toBeDisabled()
expect(button).toBeEnabled()

// Text content
expect(element).toHaveTextContent('Hello')

// Attributes
expect(input).toHaveAttribute('type', 'email')
expect(input).toHaveValue('test@example.com')

// Classes
expect(element).toHaveClass('active')
```

### 4. Testing Forms

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/tests/test-utils'
import { LoginForm } from '@/components/login-form'

describe('LoginForm', () => {
  it('should submit form with valid data', async () => {
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} />)
    
    // Fill in form
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    // Submit
    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('should show validation errors', async () => {
    render(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
  })
})
```

## Best Practices

### ✅ Do's

1. **Test user behavior, not implementation**
   - Focus on what users see and do
   - Avoid testing internal state or methods

2. **Use semantic queries**
   - Prefer `getByRole`, `getByLabelText` over `getByTestId`
   - Makes tests more accessible

3. **Test accessibility**
   - Ensure proper ARIA labels
   - Check keyboard navigation

4. **Keep tests isolated**
   - Each test should be independent
   - Use `beforeEach` to reset state

5. **Use meaningful test names**
   - Describe what the test does
   - Use "should" statements

### ❌ Don'ts

1. **Don't test implementation details**
   - Avoid testing internal state
   - Don't rely on component structure

2. **Don't use `waitFor` unnecessarily**
   - Only for async operations
   - Use `findBy` queries instead when possible

3. **Don't over-mock**
   - Mock external dependencies only
   - Test real component interactions

4. **Don't write brittle tests**
   - Avoid exact text matching
   - Use regex for flexibility

## Coverage Reports

After running `pnpm test:coverage`, open the coverage report:

```bash
# Open HTML coverage report
open coverage/index.html
```

### Coverage Thresholds

Current thresholds (defined in `vitest.config.ts`):
- Lines: 60%
- Functions: 60%
- Branches: 60%
- Statements: 60%

## Debugging Tests

### 1. Use `screen.debug()`

```tsx
it('should render correctly', () => {
  render(<MyComponent />)
  
  // Print the current DOM
  screen.debug()
  
  // Print a specific element
  screen.debug(screen.getByRole('button'))
})
```

### 2. Use Vitest UI

```bash
pnpm test:ui
```

Opens a browser interface where you can:
- See test results visually
- Debug failing tests
- View coverage

### 3. Use `--reporter=verbose`

```bash
pnpm vitest --reporter=verbose
```

Shows detailed test output.

## Example Test Files

Check these files for complete examples:

1. **Component Test**: `src/components/theme-switch.test.tsx`
2. **Interactive Component**: `src/components/password-input.test.tsx`
3. **Hook Test**: `src/hooks/use-mobile.test.ts`
4. **API Mocking**: `src/tests/examples/api-mocking.test.tsx`

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)

## Quick Reference

### File Naming Convention
- Component tests: `ComponentName.test.tsx`
- Hook tests: `use-hook-name.test.ts`
- Utility tests: `utility-name.test.ts`

### Test Structure
```tsx
describe('ComponentName', () => {
  it('should do something', () => {
    // Arrange
    render(<Component />)
    
    // Act
    fireEvent.click(screen.getByRole('button'))
    
    // Assert
    expect(screen.getByText('Result')).toBeInTheDocument()
  })
})
```

Happy Testing! 🧪
