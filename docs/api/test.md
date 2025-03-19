# Test API

Cerebral provides testing utilities to help you test your application logic. There are two main approaches to testing in Cerebral:

1. **Snapshot testing** - Test sequences by capturing and verifying their execution flow
2. **Unit testing** - Test individual components, actions, and computed values

## Snapshot Testing API

### Snapshot

Creates a snapshot test environment for your application. Pass your main module:

```js
import { Snapshot } from 'cerebral/test'
import main from './main'

const snapshot = Snapshot(main)
```

### run

Runs a sequence with an optional payload, returning a promise:

```js
Snapshot(main)
  .run('app.sequences.submitForm', { username: 'test' })
  .then((snapshot) => {
    expect(snapshot.get()).toMatchSnapshot()
  })
```

### mutate

Modifies state before running the sequence:

```js
Snapshot(main)
  .mutate('set', 'users.isLoading', true)
  .run('app.sequences.loadUsers')
```

Available mutations: `set`, `toggle`, `push`, `concat`, `pop`, `shift`, `unshift`, `splice`, `merge`, `unset`

### mock

Mocks provider methods that will be called during sequence execution:

```js
// Mock with return value
Snapshot(main).mock('http.get', { users: [] }).run('app.sequences.loadUsers')

// Mock with function
Snapshot(main)
  .mock('http.get', (context, url) => {
    expect(url).toBe('/api/users')
    return { users: [{ id: 1, name: 'Test' }] }
  })
  .run('app.sequences.loadUsers')
```

### mockResolvedPromise / mockRejectedPromise

Mock asynchronous provider methods that return promises:

```js
// Mock resolved promise
Snapshot(main)
  .mockResolvedPromise('http.get', { users: [] })
  .run('app.sequences.loadUsers')

// Mock rejected promise
Snapshot(main)
  .mockRejectedPromise('http.get', { error: 'Network error' })
  .run('app.sequences.loadUsers')
```

## Unit Testing API

### runCompute

Test computed values:

```js
import { runCompute } from 'cerebral/test'
import { multiply } from './computed'

it('should multiply values', () => {
  const result = runCompute(multiply, {
    state: { value: 5 },
    props: { multiplier: 2 }
  })
  expect(result).toBe(10)
})
```

### runAction

Test individual actions:

```js
import { runAction } from 'cerebral/test'
import { increment } from './actions'

it('should increment counter', async () => {
  const { state } = await runAction(increment, {
    state: { count: 1 }
  })
  expect(state.count).toBe(2)
})
```

The promise resolves with an object containing:

- `state`: Updated state
- `props`: Props passed to the action
- `output`: Action's output

### runSequence

Test sequences:

```js
import { runSequence } from 'cerebral/test'
import { submitForm } from './sequences'

it('should validate form', async () => {
  const { state } = await runSequence(submitForm, {
    state: { form: { username: '' } },
    props: { submitted: true }
  })
  expect(state.form.isValid).toBe(false)
})
```

### CerebralTest

Create a test environment for running multiple sequences with the same controller:

```js
import { CerebralTest } from 'cerebral/test'
import app from './app'

it('should manage user sessions', async () => {
  const test = CerebralTest(app)

  // Set initial state
  test.setState('user.isLoggedIn', false)

  // Run first sequence
  await test.runSequence('user.login', {
    username: 'test',
    password: 'password'
  })

  // Check state between sequences
  expect(test.getState('user.isLoggedIn')).toBe(true)

  // Run another sequence
  await test.runSequence('user.logout')
  expect(test.getState('user.isLoggedIn')).toBe(false)
})
```

#### Options

CerebralTest accepts an options object as second parameter:

```js
const test = CerebralTest(app, {
  throwToConsole: true, // Log errors to console
  recordActions: 'byName' // Record actions by name instead of index
})
```

With `recordActions: 'byName'`, action results are accessible by action name:

```js
const { validateForm } = await test.runSequence('form.submit')
expect(validateForm.output.isValid).toBe(true)
```

## Component Testing

Test components with Cerebral containers:

```js
import { mount } from 'enzyme'
import App from 'cerebral'
import { Container } from '@cerebral/react'
import UserComponent from './UserComponent'

it('should render user data', () => {
  const app = App({
    state: {
      user: { name: 'Test' }
    }
  })

  const wrapper = mount(
    <Container app={app}>
      <UserComponent />
    </Container>
  )

  expect(wrapper.find('.user-name').text()).toBe('Test')
})
```
