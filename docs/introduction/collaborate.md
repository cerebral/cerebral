# Collaborate

Writing code is not only about you and the computer, it is about you and your team. You write the code not only to make the computer understand it, but also your team to understand. Cerebral is about building mental images of how your application works and therefor naturally makes it easier to collaborate on projects.

## Components

Generally in projects it is a good idea to completely separate stateless basic UI components from components that you would connect to Cerebral. A typical example of this would be a **Button**. That is a stateless UI component, while a **Posts** component would most likely be connected to some state. When you think about components this way you can even keep them in two separate projects or folders.

So one approach to this is using [React Storybook](https://getstorybook.io/). You can set up your project which uses storybook to develop components with hot reloading. This also becomes a really great archive of your basic component types, which are composed together in the application project. In your Webpack setup you can use **alias** to point to these stateless components.

Given this folder structure:

```js
base-components/
  /Button
  /Column
src/
  /components
  /modules
  controller.js
  main.js
```

*webpack.config.js*
```js
{
  ...,
  resolve: {
    alias: {
      'base-components': path.resolve('base-components')
    }
  },
}
```

Base components is a really good entrypoint to a project and coding in general. If you get new people on the team, let them get productive straight away building components.

## Signals
An opportunity you get as a team using Cerebral is a "framework to plan out logic". Sometimes a user interaction leads to a single state change, but more often it can be rather complex. You will need to talk about logically what this user interaction should lead to.

Together you can define the signal. Since it is declarative there is no need to implement anything:

```js
[
  set(state`posts.isLoading`, true),
  getPosts, {
    success: [
      set(state`posts.list`, sort(props`posts`)),
      redirect(string`/posts/${state`posts.list.0.id`}`)
    ],
    error: showError('Could not get posts')
  }
]
```

This is a very simple signal, but just discussing where to store state, what to name it and how to best compose is something that should be a regular exercise in teams. This is not only related to Cerebral, but any shared codebase. Cerebral just gives you an abstraction that makes this very easy to do.
