# Cerebral ![build status](https://travis-ci.org/christianalfoni/cerebral.svg?branch=master)
A state controller with its own debugger

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/christianalfoni/cerebral?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

<img src="images/logo.jpg" width="300" align="center">

- [What is Cerebral?](#what-is-cerebral)
- [How to get started](#how-to-get-started)
- [How to create a custom Cerebral package](#how-to-create-a-custom-cerebral-package)

## What is Cerebral?
To get an understanding of Cerebral I suggest you choose your preferred media:

- [Watch this video on Cerebral](https://www.youtube.com/watch?v=xCIv4-Q2dtA)
- [Watch this video on signals and actions](https://www.youtube.com/watch?v=ylJG4vUx_Tc)
- [Read this article on why you might need Cerebral](http://www.christianalfoni.com/articles/2015_08_02_Why-we-are-doing-MVC-and-FLUX-wrong)
- [Check out a demo using the debugger](http://www.christianalfoni.com/todomvc)

## How to get started

### 1. Install debugger
Install the [Chrome Cerebral Debugger](https://chrome.google.com/webstore/detail/cerebral-debugger/ddefoknoniaeoikpgneklcbjlipfedbb)

### 2. Choose a package
The Cerebral Core API is "low level", but extremely flexible. If you do not have any specific needs in regards of VIEW or MODEL layer, you can choose one of the preset packages that will get you quickly up and running:

- [cerebral-react-immutable-store](https://github.com/christianalfoni/cerebral-react-immutable-store) - [Video introduction](https://www.youtube.com/watch?v=QG181MnRIXM)
- [cerebral-react-native-immutable-store](https://github.com/christianalfoni/cerebral-react-native-immutable-store)
- [cerebral-angular-immutable-store](https://github.com/christianalfoni/cerebral-angular-immutable-store) - [Video introduction](https://www.youtube.com/watch?v=YVmgLReFjLw)
- [cerebral-react-baobab](https://github.com/christianalfoni/cerebral-react-baobab)
- cerebral-jquery-immutable-store
- cerebral-react-immutable-js

### 3. Signals and actions
To create a signal please read the README of the chosen package. To define a signals action chain, please read on. This is the same for all packages.

- [Naming](#naming)
- [Action](#action)
- [Arguments](#arguments)
- [Chain](#chain)
- [Trigger](#trigger)
- [Paths](#paths)
- [Async](#async)
- [Outputs](#outputs)
- [Types](#types)
- [Custom Types](#custom-types)
- [Groups](#groups)

#### Naming
The way you think of signals is that something happened in your application. Either in your VIEW layer, a router, maybe a websocket connection etc. So the name of a signal should define what happened: "appMounted", "inputChanged", "formSubmitted". The actions are named by their purpose, like "setInputValue", "postForm" etc. This will make it very easy for you to read and understand the flow of the application. All signal definitions first tells you "what happened in your app". Then each action describes its part of the flow that occurs when the signal triggers.

#### Action
The convention is to create each action as its own module. This will keep your project clean and let you easily extend actions with type checks and other options. It is important to name your functions as that will make it easier to read debugging information.
```js
function myAction () {

};

export default myAction;
```

#### Arguments
```js
function MyAction (args, state, output) {
  // Args contains all arguments passed to the signal itself
  // and any args passed from one action to the next
  args

  // State contains the methods for mutating the state of
  // your application.
  state.set('isLoading', false);
  state.unset('isLoading');
  state.merge('user', {name: 'foo'});
  state.push('list', 'foo');
  state.unshift('list', 'bar');
  state.pop('list');
  state.shift('list');
  state.concat('list', [1, 2, 3]);
  state.splice('list', 1, 1, [1]);

  // Use an array as path to reach nested values
  state.push(['admin', 'users'], {foo: 'bar'});

  // It also contains the method for getting state
  state.get('foo');
  state.get(['foo', 'bar']);

  // The output argument is what you use to resolve arguments
  // and choose paths. By default you can use "success" or "error"
  // path
  output({foo: 'bar'});
  output.success({foo: 'bar'});
  output.error({foo: 'bar'});
};

export default MyAction;
```
#### Chain
*actions/setLoading.js*
```js
function setLoading (args, state) {
  state.set('isLoading', true);
};
export default setLoading;
```
*actions/setTitle.js*
```js
function setTitle (args, state) {
  state.set('title', 'Welcome!');
};
export default setTitle;
```
*main.js*
```js
import controller from './controller.js';

import setLoading from './actions/setLoading.js';
import setTitle from './actions/setTitle.js';

controller.signal('appMounted',
  setLoading,
  setTitle
);
```
#### Trigger
```js
controller.signal('appMounted',
  setLoading,
  setTitle
);

// Just trigger
controller.signals.appMounted();

// With argument
controller.signals.appMounted({
  foo: 'bar'
});

// Force sync trigger
controller.signals.appMounted(true, {
  foo: 'bar'
});
```

#### Paths
Paths allows you to conditionally run actions depending on the result of the previous action. This is typically useful with asynchronous actions, but you can use them next to any action you run. The default paths are `success` and `error`, but you can define custom paths if you need to.

*main.js*
```js
import controller from './controller.js';

import checkSomething from './actions/checkSomething.js';
import setSuccessMessage from './actions/setSuccessMessage.js';
import setErrorMessage from './actions/setErrorMessage.js';

controller.signal('appMounted',
  chooseColor, {
    success: [setSuccessMessage],
    error: [setErrorMessage]
  }
);
```

#### Async
Async actions are defined like normal actions, only inside an array.

*main.js*
```js
import controller from './controller.js';

import loadUser from './actions/loadUser.js';
import setUser from './actions/setUser.js';
import setError from './actions/setError.js';

controller.signal('appMounted',
  [
    loadUser, {
      success: [setUser],
      error: [setError]
    }
  ]
);
```

When defining multiple actions in an array, they will run async in parallel and their outputs will run after all initial async actions are done.
*main.js*
```js
import controller from './controller.js';

import loadUser from './actions/loadUser.js';
import setUser from './actions/setUser.js';
import setUserError from './actions/setUserError.js';
import loadProjects from './actions/loadProjects.js';
import setProjects from './actions/setProjects.js';
import setProjectsError from './actions/setProjectsError.js';

controller.signal('appMounted',
  [
    loadUser, {
      success: [setUser],
      error: [setUserError]
    },
    loadProjects, {
      success: [setProjects],
      error: [setProjectsError]
    }
  ]
);
```

#### Outputs
You can define custom outputs. This will override the default "success" and "error" outputs. What is especially nice with manually defining outputs is that they will be analyzed by Cerebral. You will get errors if you use your actions wrong, are missing paths for your outputs etc.

```js
function myAction (args, state, output) {
  if (state.get('isCool')) {
    output.foo();
  } else if (state.get('isAwesome')) {
    output.bar();
  } else {
    output();
  }
};

// The defaultOutput property lets you call "output"
// to the default output path
myAction.defaultOutput = 'foo';
myAction.outputs = ['foo', 'bar'];

export default myAction;
```

#### Types
You can type check the inputs and outputs of an action to be notified when you are using your signals the wrong way.

```js
function myAction (args, state, output) {
  output({foo: 'bar'});
};

// Define what args you expect to be received on this action
myAction.input = {
  isCool: String
};

// If the action only has one output
myAction.output = {
    foo: String
};

// If having multiple outputs
myAction.outputs = {
  success: {
    result: Object
  },
  error: {
    message: String
  }
};

export default myAction;
```
The following types are available: **String, Number, Boolean, Object, Array**, its the default type constructors in JavaScript. 

#### Custom Types
You can use a function instead. That allows you to use any typechecker.

```js
function myAction (args, state, output) {
  output({foo: 'bar'});
};

// Define what args you expect to be received on this action
myAction.input = {
  isCool: function (value) {
    return typeof value === 'string' || typeof value === 'number';
  },
  isNotCool: MyTypeChecker.isString
};
````

#### Groups
By using ES6 syntax you can easily create groups of actions that can be reused.
```js
const MyGroup = [Action1, Action2, Action3];
controller.signal('appMounted', Action4, ...MyGroup);
controller.signal('appMounted', Action5, ...MyGroup, Action6);
```


## How to create a custom Cerebral package
If the current packages does not meet your needs you are free to create your own package with its own VIEW and MODEL layer. To define a Controller you need somewhere to store the state. You can use whatever you want in this regard, but to gain the full power of the developer tools the state store should be immutable. This specifically allows you to move back and forth in time in the debugger and you will gain benefits in rendering optimization.

In this example we will use the [immutable-store](https://github.com/christianalfoni/immutable-store) project as a state store, but [freezer](https://github.com/arqex/freezer), [baobab](https://github.com/Yomguithereal/baobab), [immutable-js](https://github.com/facebook/immutable-js) are also good alternatives.

*index.js*
```js

var Cerebral = require('cerebral');
var Store = require('immutable-store');
var EventEmitter = require('events').EventEmitter;

// The Cerebral controller
var Controller = Cerebral.Controller;

// Value is a helper function that takes a path and an object.
// The returned result is the value at the path
var Value = Cerebral.Value;

// We return a function that will take two arguments. This is what the user of the
// package will use to create a controller
module.exports = function (state, defaultArgs) {

  // We create an immutable store with the state passed
  var initialState = Store(state);

  // We create an eventHub to notify about changes to the state
  var events = new EventEmitter();

  // We redefine the current state to be the initial state
  state = initialState;

  // Then we create a Cerebral controller
  var controller = Controller({

    // Cerebral requires the state to be reset when using the debugger,
    // this is how you would do it with immutable-store
    onReset: function () {
      state = initialState;
    },

    // When an action fails for some reason you can react to that
    onError: function (error) {
      events.emit('error', error);
    },

    // We trigger a change event and passing the current state
    onUpdate: function () {
      events.emit('change', state);
    },

    // When the debugger has traversed time we can choose to handle
    // this differently, but in this case we just update the UI the same
    // way as the onUpdate
    onRemember: function () {
      events.emit('change', state);
    },

    // If the user wants to use the recorder the initial state of the
    // recording needs to be set and an event is emitted to indicate
    // the new state
    onSeek: function (seek, isPlaying, recording) {
      state = state.import(recording.initialState);
      events.emit('change', state);
    },

    // onGet is used to return some state
    onGet: function (path) {
      return Value(path, state);
    },

    // Mutations
    onSet: function (path, value) {
      var key = path.pop();
      state = Value(path, state).set(key, value);
    },
    onUnset: function (path, key) {
      state = Value(path, state).unset(key);
    },
    onPush: function (path, value) {
      state = Value(path, state).push(value);
    },
    onSplice: function () {
      var args = [].slice.call(arguments);
      var value = Value(args.shift(), state);
      state = value.splice.apply(value, args);
    },
    onMerge: function (path, value) {
      state = Value(path, state).merge(value);
    }
  });

  // We attach the eventHub to the controller
  controller.events = events;

  return controller;

};
```

## Demos
**TodoMVC**: [www.christianalfoni.com/todomvc](http://www.christianalfoni.com/todomvc)

## Cerebral - The beginning
Read this article introducing Cerebral: [Cerebral developer preview](http://christianalfoni.com/articles/2015_05_18_Cerebral-developer-preview)

## Contributors
- Discussions and code contributions - **Marc**
- Logo and illustrations - **Petter Stenberg Hansen**
- Article review - **Jesse Wood**

Thanks guys!
