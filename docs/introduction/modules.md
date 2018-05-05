# Modules

```marksy
<Youtube url="https://www.youtube.com/embed/QJnDxez9qtY" />
```

The main building block of Cerebral is the **Module**. In your project create a new folder called `src/app`. This is where your main module will live. Create a file named **index.js** and add the following content:

```js
import { Module } from 'cerebral'

export default Module({
  state: {
    title: 'My Project'
  }
})
```

You have now succesfully added state to your application, a title state. This module will act as the root module of the project and needs to be added to the controller.

Create a new file in `src` named **controller.js** and add the following content:

```js
import { Controller } from 'cerebral'
import app from './app'

export default Controller(app)
```

**That is it!** Cerebral is now wired up and we can start building the application. But first, lets hook on the debugger.
