# Devtools

## Install debuger

[Download the Debugger](https://github.com/cerebral/cerebral-debugger/releases) for your target OS:

* **Mac**: cerebral-debugger-x.x.x.dmg
* **Windows**: cerebral-debugger-setup-x.x.x.exe
* **Linux**: cerebral-debugger_x.x.x_amd64.deb

## Initialize

You initialize the devtools by adding it to the app. In the **index.js** file you can adjust the content to:

```js
import { App } from 'cerebral'
import Devtools from 'cerebral/devtools'

const app = App({
  state: {
    title: 'My Project'
  }  
}, {
  devtools: Devtools({
    host: 'localhost:8585'
  })
})
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
