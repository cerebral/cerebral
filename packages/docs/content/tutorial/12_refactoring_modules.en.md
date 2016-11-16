---
title: ch11. Modules
---

## Modules

**Load up chapter 11** - [Preview](11)

Glad you are still with us! Hopefully you have enjoyed our journey so far and hopefully you still have a sip left of your coffee or drink. It's time for cleaning up.

Welcome to the world of **modules**. We will build the following structure:

```
.
├── public
|	├── index.html
|	└── ...
├── src
|	├── components
|	|	├── App
|	|	├── Toast
|	├── modules
|	|	├── Home
|	|	├── Repos
|	└── index.js
├── package.json
├── ...
```

Our *./src/index.js* looks a lot cleaner and we have put our code into the conventional folders recommended by the Cerebral community. Let us look closer at the changes:

```js
...
import app from './modules/app'
import home from './modules/home'
import repos from './modules/repos'
...
const controller = Controller({
  modules: {app, home, repos}
  ...
})
...
```

First of all we now load all our state and signals from modules. An example of a module is:

```js
import openRepos from './chains/openRepos'

export default {
  state: {
    list: {}
  },
  signals: {
    routed: openRepos
  }
}
```

The signals references chain that lives in their own files. This makes it super easy to compose chains into multiple signals.

The only difference now is that the modules namespaces our state and signals, which means we need to prefix the pointers in the router and components to the correct path.

```js
export default connect({
  title: 'app.title',
  subTitle: 'app.subTitle',
  repos: 'repos.list',
  activeTab: 'app.activeTab'
}, ...)
```

So there is no magic to **modules**, they just namespace signals and state. There is no isolation going on. Any module can change any state of the application. This prevents you from getting into problems as your application grows.

Congratulations! You have reached the end of our *Get Started* - tutorial.
There is a lot of other good stuff on this website. So please check it out!

As a **last challenge**: Build your next big thing with **Cerebral** and please tell us about it on [discord chat](https://discord.gg/0kIweV4bd2bwwsvH) :)
