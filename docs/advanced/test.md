# Testing Cerebral Applications

Testing is an essential part of building maintainable applications. Cerebral provides powerful tools for testing your application logic at different levels.

## Snapshot Testing

Snapshot testing allows you to create tests that verify the execution of sequences including state changes, provider calls, and action outputs. This approach is particularly useful for testing complex sequences with multiple actions and side effects.

### Creating Snapshot Tests with the Debugger

The simplest way to create snapshot tests is directly from the Cerebral debugger:

1. Run your application with the Cerebral debugger connected
2. Trigger the sequence you want to test in your application
3. Select the sequence in the debugger sidebar
4. Click "Create sequence test" button
5. Paste the generated code into your test file

This generates a test that will verify the exact execution flow of your sequence, including:

- Actions executed
- State mutations
- Provider method calls
- Paths taken

### Writing Snapshot Tests Manually

You can also write snapshot tests manually to have more control over the test setup:

```js
import { Snapshot } from 'cerebral/test'
import main from './main'

describe('User authentication', () => {
  it('should authenticate user with valid credentials', () => {
    return (
      Snapshot(main)
        // Set up the initial state
        .mutate('set', 'auth.isLoading', false)
        .mutate('set', 'auth.error', null)

        // Mock API responses
        .mockResolvedPromise('http.post', {
          token: 'valid-jwt-token',
          user: { id: '123', name: 'Test User' }
        })

        // Run the sequence with test data
        .run('auth.login', {
          username: 'testuser',
          password: 'password123'
        })
        .then((snapshot) => {
          // Verify execution against stored snapshot
          expect(snapshot.get()).toMatchSnapshot()
        })
    )
  })

  it('should handle authentication failures', () => {
    return (
      Snapshot(main)
        .mutate('set', 'auth.isLoading', false)
        .mutate('set', 'auth.error', null)

        // Mock API error response
        .mockRejectedPromise('http.post', {
          statusCode: 401,
          message: 'Invalid credentials'
        })

        .run('auth.login', {
          username: 'testuser',
          password: 'wrongpassword'
        })
        .then((snapshot) => {
          expect(snapshot.get()).toMatchSnapshot()
        })
    )
  })
})
```

### Understanding Snapshot Tests

When a snapshot test runs, it:

1. Creates a clean instance of your application
2. Sets up the initial state with any mutations you specify
3. Prepares mock implementations for provider methods
4. Runs the specified sequence with your provided props
5. Records all state mutations, provider calls, and action executions
6. Compares this execution record against the stored snapshot

If your sequence implementation changes in a way that affects the execution flow, the test will fail, prompting you to review the changes.

## Unit Testing

While snapshot tests verify the entire execution flow, unit tests focus on testing individual parts of your application.

### Testing Actions

Actions are pure functions that can be tested in isolation:

```js
import { runAction } from 'cerebral/test'
import { submitForm } from './actions'

describe('Form actions', () => {
  it('should validate form data', async () => {
    const { state, output } = await runAction(submitForm, {
      state: {
        form: {
          name: '',
          email: 'invalid',
          terms: false
        }
      }
    })

    expect(output.isValid).toBe(false)
    expect(state.form.errors.name).toBe('Name is required')
    expect(state.form.errors.email).toBe('Invalid email format')
    expect(state.form.errors.terms).toBe('You must accept the terms')
  })
})
```

### Testing Computed Values

Computed values can be tested with the `runCompute` helper:

```js
import { runCompute } from 'cerebral/test'
import { filteredUsers } from './computed'

describe('User filtering', () => {
  it('should filter active users', () => {
    const users = runCompute(filteredUsers, {
      state: {
        users: [
          { id: 1, name: 'User 1', active: true },
          { id: 2, name: 'User 2', active: false },
          { id: 3, name: 'User 3', active: true }
        ],
        filters: {
          showActive: true
        }
      }
    })

    expect(users.length).toBe(2)
    expect(users[0].id).toBe(1)
    expect(users[1].id).toBe(3)
  })

  it('should filter by search term', () => {
    const users = runCompute(filteredUsers, {
      state: {
        users: [
          { id: 1, name: 'John Doe', active: true },
          { id: 2, name: 'Jane Smith', active: true },
          { id: 3, name: 'Bob Johnson', active: true }
        ],
        filters: {
          searchTerm: 'jo'
        }
      }
    })

    expect(users.length).toBe(2)
    expect(users[0].name).toBe('John Doe')
    expect(users[1].name).toBe('Bob Johnson')
  })
})
```

### Testing Sequences

Test complete sequences with the `runSequence` helper:

```js
import { runSequence } from 'cerebral/test'
import { fetchUsers } from './sequences'

describe('User sequences', () => {
  it('should load and filter users', async () => {
    // Mock providers if needed
    const mockHttp = {
      get: () =>
        Promise.resolve({
          users: [
            { id: 1, name: 'User 1', role: 'admin' },
            { id: 2, name: 'User 2', role: 'user' }
          ]
        })
    }

    const { state } = await runSequence(fetchUsers, {
      state: {
        users: {
          list: [],
          isLoading: false,
          filter: 'admin'
        }
      },
      props: { pageSize: 10 },
      providers: { http: mockHttp }
    })

    expect(state.users.isLoading).toBe(false)
    expect(state.users.list.length).toBe(1)
    expect(state.users.list[0].role).toBe('admin')
  })
})
```

### Testing Multiple Sequences

The `CerebralTest` factory is useful for testing sequences that build upon each other:

```js
import { CerebralTest } from 'cerebral/test'
import app from './app'

describe('Shopping cart', () => {
  let cerebral

  beforeEach(() => {
    // Create fresh test environment for each test
    cerebral = CerebralTest(app, {
      recordActions: 'byName'
    })

    // Set initial state
    cerebral.setState('cart', { items: [], total: 0 })
  })

  it('should manage shopping cart operations', async () => {
    // Add first item
    await cerebral.runSequence('cart.addItem', {
      product: { id: 1, name: 'Product 1', price: 10 },
      quantity: 2
    })

    expect(cerebral.getState('cart.items').length).toBe(1)
    expect(cerebral.getState('cart.total')).toBe(20)

    // Add second item
    await cerebral.runSequence('cart.addItem', {
      product: { id: 2, name: 'Product 2', price: 15 },
      quantity: 1
    })

    expect(cerebral.getState('cart.items').length).toBe(2)
    expect(cerebral.getState('cart.total')).toBe(35)

    // Remove item
    await cerebral.runSequence('cart.removeItem', { productId: 1 })

    expect(cerebral.getState('cart.items').length).toBe(1)
    expect(cerebral.getState('cart.total')).toBe(15)
  })
})
```

## Testing Components

When testing components that use Cerebral, you'll often want to verify that:

1. Components correctly access state and computed values
2. Components trigger the right sequences with the right props

### React Components

```js
import React from 'react'
import { mount } from 'enzyme'
import App from 'cerebral'
import { Container } from '@cerebral/react'
import UserList from './UserList'

describe('UserList component', () => {
  it('should render users and handle pagination', () => {
    // Create test module with necessary state and mocked sequences
    const testModule = {
      state: {
        users: [
          { id: 1, name: 'User 1' },
          { id: 2, name: 'User 2' }
        ],
        currentPage: 1,
        totalPages: 3
      },
      sequences: {
        pageChanged: jest.fn()
      }
    }

    const app = App(testModule)

    const wrapper = mount(
      <Container app={app}>
        <UserList />
      </Container>
    )

    // Verify rendering
    expect(wrapper.find('.user-item').length).toBe(2)
    expect(wrapper.find('.pagination').exists()).toBe(true)

    // Trigger sequence
    wrapper.find('.next-page').simulate('click')

    // Verify sequence was called with correct props
    expect(testModule.sequences.pageChanged).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2 })
    )
  })
})
```

## Best Practices

1. **Use snapshot tests for complex flows** - Snapshot tests are ideal for testing integration points and complex sequences.

2. **Use unit tests for logic** - Test individual actions and computed values with unit tests for faster feedback.

3. **Mock providers consistently** - Establish patterns for mocking provider methods to ensure consistent test behavior.

4. **Test both success and error paths** - Ensure your tests cover error scenarios as well as happy paths.

5. **Test state transitions** - Verify that your application moves correctly between states, especially for features like authentication, forms, and wizards.

6. **Isolate tests** - Make sure tests are isolated and don't depend on each other's state changes.

7. **Consider using factories for test data** - Create factory functions that generate test data to keep tests DRY and maintainable.

For more details on the testing API, see the [Test API reference](/docs/api/test.html).
