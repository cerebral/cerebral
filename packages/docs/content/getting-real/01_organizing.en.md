---
title: Organizing
---

## Organizing

Cerebral uses a concept called **modules** to organize your code. They allow you to wrap state and signals into a namespace in your application, but it does not isolate them. Any action run in a signal can change whatever state in your application.

Typically you will define a file structure like.

```js
/modules
  /Home
    /actions
    /chains
    index.js
main.js
```

In your **main.js** file you define the main controller.

```js
import {Controller} from 'cerebral'
import HomeModule from './modules/Home'

const controller = Controller({
  modules: {
    home: HomeModule
  }
})
```

Any signals and state you define inside the *Home* module will now live on the chosen namespace: **home**.

The *modules/Home/index.js* file will look something like:

```js
import updateLatestPosts from './chains/updateLatestPosts'

export default {
  state: {
    latestPosts: []
  },
  signals: {
    mounted: updateLatestPosts
  }
}
```

And this is how you scale your application. You define modules and submodules. Any actions or chains that are common are usually placed in a common folder.

```js
/common
  /actions
  /chains
/modules
  /Home
    /actions
    /chains
    index.js
main.js
```

### View

A very important point in Cerebral is that your components (view) does not affect how you structure your state. You define modules in terms of what makes sense for state and signals. Sometimes this is similar, but often it is not. So your components should live separately from modules.

```js
/components
  /Home
    index.js
/common
  /actions
  /chains
/modules
  /Home
    /actions
    /chains
    index.js
main.js
```

And this is it. You will never get in trouble creating a module because any action can change any state in your application. Modules are just a way to structure state and signals, not isolate them.
