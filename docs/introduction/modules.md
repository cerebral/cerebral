# Modules

The main building block of Cerebral is the **Module**. It helps you organize your application and it is an extension point to share logic between apps. In your project open the file `src/index.js`. Add the following content:

```js
import App from 'cerebral'

const app = App({
  state: {
    title: 'My Project'
  }
})
```

**That is it!** Cerebral is now wired up and we can start building the application. When your application grows you can extend a module with submodules:

```js
import App from 'cerebral'

const app = App({
  state: {
    title: 'My Project'
  },
  modules: {
    someOtherModule: {
      state: {}
    }
  }
})
```

But before looking more into organizing your project, let us look at the devtools.
