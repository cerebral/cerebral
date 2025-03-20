# Cerebral

A declarative state and side effects management solution for popular JavaScript frameworks

[![NPM version][npm-image]][npm-url]
[![Commitizen friendly][commitizen-image]][commitizen-url]
[![Discord][discord-image]][discord-url]
![Cerebral Logo](images/logo.png)

## Project Status

Cerebral 5.3 is the latest release, bringing modern API patterns and significant improvements:

- Supports full type safety in your application
- Updated integrations for the latest view libraries (React, Vue, etc.)
- Compatibility with modern lint, build and publish tools
- Updated documentation
- Bug fixes and performance improvements

The project is currently in maintenance mode. We accept PRs and Issues for bug fixes.
While we're not actively developing new features, if you have a reasonable feature request,
please create an issue. If we agree that the request adds value and it receives community
support (indicated by thumbs up), we may consider implementing it.

## Framework Support

Cerebral works seamlessly with all major frontend frameworks:

- **React**: Compatible with React 16.3 through React 19
- **Vue**: Full support for Vue 3, with backward compatibility for Vue 2.6+
- **Preact**: Works with Preact X (v10+) and older v8
- **Inferno**: Supports v4 through v9
- **Angular**: Compatible with Angular 14 through 19

## Getting Started

### Installation

```sh
# Using npm
npm install cerebral

# Using yarn
yarn add cerebral

# Using pnpm
pnpm add cerebral
```

### Basic Example (React)

```jsx
import React from 'react'
import { createApp } from 'cerebral'
import { Container, connect } from '@cerebral/react'
import { state, sequences } from 'cerebral'

// Create an action
const increment = ({ store, get }) => {
  // Use 'store' to update state
  store.set(state`count`, get(state`count`) + 1)
}

// Create app with state and sequences
const app = createApp({
  state: {
    count: 0
  },
  sequences: {
    increment: [increment]
  }
})

// Connect component to Cerebral
const Counter = connect(
  {
    count: state`count`,
    increment: sequences`increment`
  },
  function Counter({ count, increment }) {
    return (
      <div>
        <h1>Count: {count}</h1>
        <button onClick={() => increment()}>Increment</button>
      </div>
    )
  }
)

// Provide the app to your component tree
const App = () => (
  <Container app={app}>
    <Counter />
  </Container>
)
```

For more detailed examples, check the documentation. If you prefer the proxy syntax (`state.count` instead of `` state`count` ``), see our [proxy documentation](http://www.cerebraljs.com/docs/api/proxy.html).

## Documentation

You can find the Cerebral documentation at [cerebraljs.com](http://www.cerebraljs.com/).

## Contribute

Cerebral is organized as a monorepo to make contributions easier:

1. Clone the repo: `git clone https://github.com/cerebral/cerebral.git`
2. Install dependencies: `npm install` (from the root folder)

You don't need to run `npm install` in each package directory - the monorepo setup handles this for you.

### Testing

Run all tests from the root directory:

```sh
npm test
```

Or run tests for a specific package:

```sh
# Navigate to the package
cd packages/cerebral

# Run tests for just this package
npm test
```

### Making Changes

1. Create a branch for your changes
2. Make your code changes and add tests
3. Commit from the root using our guided format:

   ```sh
   npm run commit
   ```

4. Push your branch and create a pull request on GitHub

### Using the monorepo for development

If you want to use your local Cerebral code in your own project, you can create symlinks to the packages:

```sh
# From your project root
ln -s ../../cerebral/packages/node_modules/cerebral/ node_modules/
ln -s ../../cerebral/packages/node_modules/@cerebral/ node_modules/
```

Remember to remove these links before installing from npm:

```sh
unlink node_modules/cerebral
unlink node_modules/@cerebral
```

### Release process

- Review and merge PRs into `next` branch. It is safe to use "Update branch",
  the commit created by Github will not be part of `next` history
- From command line:

```bash
git switch next
git pull
npm install      # make sure any new dependencies are installed
npm run release -- --dry-run --print-release  # and check release notes
git switch master
git pull
git merge --ff-only next
git push
```

[npm-image]: https://img.shields.io/npm/v/cerebral.svg?style=flat
[npm-url]: https://npmjs.org/package/cerebral
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat
[commitizen-url]: http://commitizen.github.io/cz-cli/
[discord-image]: https://img.shields.io/badge/discord-join%20chat-blue.svg?style=flat
[discord-url]: https://discord.gg/0kIweV4bd2bwwsvH
