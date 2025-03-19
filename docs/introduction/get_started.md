# Get Started with Cerebral

Cerebral is a state management tool that helps you structure your application logic and debug with ease. Watch the introduction video to learn the core concepts:

```marksy
<Youtube url="https://www.youtube.com/embed/mYkM8CiVsXw" />
```

## Installation

### Prerequisites

1. Install [Node.js](https://nodejs.org/en/) (version 10 or later)
2. A JavaScript project set up with npm or yarn

### Install Cerebral

Add Cerebral to your project:

```bash
# Using npm
npm install cerebral

# Using yarn
yarn add cerebral
```

You also need to install a [view integration](docs/introduction/views.md).

## Create Your First Cerebral App

Here's a minimal example to get started with Cerebral and React:

```js
// index.js
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from 'cerebral'
import { Container } from '@cerebral/react'
import Devtools from 'cerebral/devtools'

// Define your main module with state and sequences
const main = {
  state: {
    count: 0
  },
  sequences: {
    increment: ({ store }) => store.set('count', store.get('count') + 1),
    decrement: ({ store }) => store.set('count', store.get('count') - 1)
  }
}

// Initialize the app with optional devtools
const app = App(main, {
  devtools:
    process.env.NODE_ENV === 'production'
      ? null
      : Devtools({ host: 'localhost:8585' })
})

// Create a simple counter component
function Counter({ get, sequences }) {
  const count = get(state`count`)

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={sequences.increment}>+</button>
      <button onClick={sequences.decrement}>-</button>
    </div>
  )
}

// Connect the component to Cerebral
const ConnectedCounter = connect(Counter)

// Render the app
const root = createRoot(document.getElementById('root'))
root.render(
  <Container app={app}>
    <ConnectedCounter />
  </Container>
)
```

## Debugger Installation

The Cerebral Debugger is a standalone application that connects to your app and provides visualization of state, sequences, and component updates.

### Download Options

Download the [Cerebral Debugger](https://github.com/cerebral/cerebral-debugger/releases) for your system:

- **Mac**: cerebral-debugger-x.x.x.dmg
- **Windows**: cerebral-debugger-setup-x.x.x.exe
- **Linux**: cerebral-debugger_x.x.x_amd64.deb or snap package

After installation, open the debugger application and create a new debugger instance. The debugger automatically notifies you of updates.

```marksy
<Image src="/images/debugger_connect.png" style={{ width: 400 }} />
```

## Next Steps

1. Check out the [tutorial](/docs/introduction/tutorial.html) for a more comprehensive introduction
2. Learn how to [organize your application logic](/docs/introduction/organize.html)
3. Explore more advanced concepts in the [in-depth guides](/docs/advanced/index.html)
