# Devtools

## Install debuger

[Download the Debugger](https://github.com/cerebral/cerebral-debugger/releases) for your target OS:

* **Mac**: cerebral-debugger-x.x.x.dmg
* **Windows**: cerebral-debugger-setup-x.x.x.exe
* **Linux**: cerebral-debugger_x.x.x_amd64.snap

The debugger will automatically notify you and self-update. On Linux auto-update works only for the [snap](https://snapcraft.io) package.

## Initialize

You initialize the devtools by adding it to the controller. In the **controller.js** file you can adjust the content to:

```js
import { Controller } from 'cerebral'
import app from './app'

let Devtools = null
if (process.env.NODE_ENV === 'development') {
  Devtools = require('cerebral/devtools').default
}

export default Controller(app, {
  devtools: Devtools({
    host: 'localhost:8585'
  })
})
```

```marksy
<Info>
Since we only want to run the debugger when we are developing we can point to a special **process.env.NODE_ENV** value to figure out if that is the case. When you build your application for production neither the devtools code or any connection attempt will be part of the application.
</Info>
```

You will also need to import the controller into the main **index.js** file located at `src/`. Just delete any content there and add:

```js
import controller from './controller'
```

Open up the newly installed debugger and add a new application.

```marksy
<Image src="/images/add_app.png" style={{ width: 400 }} />
```

If you refresh your application and go to the **state** tab you should now see:

```js
{
  title: 'My Project'
}
```
