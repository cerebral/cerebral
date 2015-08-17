# Cerebral [![Build Status](https://travis-ci.org/christianalfoni/cerebral.svg?branch=master)](https://travis-ci.org/christianalfoni/cerebral)
A state controller with its own debugger

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/christianalfoni/cerebral?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

<img src="images/logo.jpg" width="300" align="center">

## The Cerebral Webpage is now launched
You can access the webpage at [http://christianalfoni.com/cerebral/](http://christianalfoni.com/cerebral/)

- [How to get started](#how-to-get-started)
- [How to create a custom Cerebral VIEW package](#how-to-create-a-custom-cerebral-view-package)
- [How to create a custom Cerebral MODEL package](#how-to-create-a-custom-cerebral-model-package)

## How to get started

### 1. Install debugger
Install the [Chrome Cerebral Debugger](https://chrome.google.com/webstore/detail/cerebral-debugger/ddefoknoniaeoikpgneklcbjlipfedbb)

### 2. Choose a package
Cerebral is the **controller** layer of your application. You will also need a **model** layer to store your state and a **view** layer to produce your UI.

An example would be:

`npm install cerebral && npm install cerebral-react && npm install cerebral-immutable-store`

The following packages are currently available:

#### Model packages
The API you use in Cerebral to change state is the same for all packages, but read their notes to see their differences.

**[cerebral-immutable-store](https://github.com/christianalfoni/cerebral-immutable-store)** by @christianalfoni. An immutable state store with the possibility to define [state that maps to other state](https://github.com/christianalfoni/immutable-store#mapping-state). This package also supports recording

**[cerebral-baobab](https://github.com/christianalfoni/cerebral-baobab)** by @Yomguithereal. An immutable state store which allows you to use facets to map state. This package does not currently support recording and uses the BETA version of Baobab V2

**cerebral-immutable-js** by @facebook (Coming soon).  Immutable state with very high performance, but lacks the possibility to map state. Does support recording

#### View packages
**[cerebral-react](https://github.com/christianalfoni/cerebral-react)** by @facebook. An application wrapper component, mixin, decorators and HOC. Pure render is built in. Can also be used with **react-native**

**[cerebral-angular](https://github.com/christianalfoni/cerebral-angular)** by @angular. A provider for using Cerebral

#### Deprecated packages
As Cerebral now allows you to choose the model layer and view layer separately these packages are **deprecated**:

- [cerebral-react-immutable-store](https://github.com/christianalfoni/cerebral-react-immutable-store) - [Video introduction](https://www.youtube.com/watch?v=QG181MnRIXM)
- [cerebral-react-native-immutable-store](https://github.com/christianalfoni/cerebral-react-native-immutable-store)
- [cerebral-angular-immutable-store](https://github.com/christianalfoni/cerebral-angular-immutable-store) - [Video introduction](https://www.youtube.com/watch?v=YVmgLReFjLw)
- [cerebral-react-baobab](https://github.com/christianalfoni/cerebral-react-baobab)

### 3. Get started
Lets look at an example. Each **model** layer repo has a detailed description of how to create a controller, and each **view** layer repo has information on how to use the controller to produce UI and change state.

```js
import Controller from 'cerebral';
import Model from 'cerebral-model-package';
import request from 'superagent'; // Ajax lib

// Define the initial state of your application
const state = {
  foo: 'bar'
};

// Define any default inputs to your signals. Often used
// to pass in utils like ajax libs etc.
const defaultInput = {
  utils: {
    request: request
  }
};

// Instantiate the model
const model = Model(state);

// Instantiate the controller by passing the model it connects to
// and any default inputs
export default Controller(model, defaultInput)
```

### 4. Signals and actions
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
function MyAction (input, state, output) {
  // Input contains all inputs passed to the signal itself
  // and any outputs from the previous actions. Using packages
  // you can also add default input like AJAX libs etc.
  input // {}

  // State contains the methods for mutating the state of
  // your application.
  state.set('isLoading', false);
  state.unset('isLoading'); // Or use array for deeper paths
  state.merge('user', {name: 'foo'});
  state.push('list', 'foo');
  state.unshift('list', 'bar');
  state.pop('list'); // Or use array for deeper paths
  state.shift('list'); // Or use array for deeper paths
  state.concat('list', [1, 2, 3]);
  state.splice('list', 1, 1, [1]);

  // Use an array as path to reach nested values
  state.push(['admin', 'users'], {foo: 'bar'});

  // It also contains the method for getting state
  state.get('foo');
  state.get(['foo', 'bar']);

  // The output argument is what you use to resolve values for
  // the next actions and choose paths. By default you can use
  // "success" or "error" path
  output({foo: 'bar'});
  output.success({foo: 'bar'});
  output.error({foo: 'bar'});
};

export default MyAction;
```
*Note*: Asynchronous actions *cannot* mutate state. Calling `set` or `merge` on the `state` parameter above will throw an error, as they will be undefined.

It is best practice not to mutate state in async actions.

#### Chain
*actions/setLoading.js*
```js
function setLoading (input, state) {
  state.set('isLoading', true);
};
export default setLoading;
```
*actions/setTitle.js*
```js
function setTitle (input, state) {
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
  checkSomething, {
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
function myAction (input, state, output) {
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
function myAction (input, state, output) {
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
function myAction (input, state, output) {
  output({foo: 'bar'});
};

// Define what args you expect to be received on this action
myAction.input = {
  isCool: function (value) {
    return typeof value === 'string' || typeof value === 'number';
  },
  isNotCool: MyTypeChecker.isString
};
```

#### Groups
By using ES6 syntax you can easily create groups of actions that can be reused.
```js
const MyGroup = [Action1, Action2, Action3];
controller.signal('appMounted', Action4, ...MyGroup);
controller.signal('appMounted', Action5, ...MyGroup, Action6);
```

## How to create a custom Cerebral VIEW package
**view** packages in Cerebral just uses an instantiated Cerebral controller to get state, do state changes and listen to state changes. The package you create basically just needs an instance of a Cerebral controller and you will have access to the following information.

```js
// The controller instantiated can be passed to the package. With React it is
// done so with a wrapper component and with Angular using a provider. You have
// to decide what makes sense for your view layer  
function myCustomViewPackage (controller) {

  // Get state
  controller.get(path);

  // Listen to state changes
  controller.on('change', function () {

  });

  // Listen to debugger time traversal
  controller.on('remember', function () {

  });

};
```
That is basically all need to update the **view** layer.

## How to create a custom Cerebral MODEL package
In this example we will use the [immutable-store](https://github.com/christianalfoni/immutable-store) project as a model.

*index.js*
```js
var Store = require('immutable-store');

// Just a small helper to use an array to grab a value
// from an object
var getValue = function (path, obj) {
  path = path.slice();
  while (path.length) {
    obj = obj[path.shift()];
  }
  return obj;
};

module.exports = function (state) {

  return function (controller) {

    // We create an immutable store with the state passed
    var initialState = Store(state);

    // We redefine the current state to be the initial state
    state = initialState;

    // Cerebral requires the state to be reset when using the debugger,
    // this is how you would do it with immutable-store
    controller.on('reset', function () {
      state = initialState;
    });

    // If you want to use the recorder the initial state of the
    // recording needs to be set to the current state before recorder
    // replays signals to current position
    controller.on('seek', function (seek, isPlaying, recording) {
      state = state.import(recording.initialState);
    });

    // This object defines how to get state and do state changes
    return {

      // You always receive an array here
      get: function (path) {
        return pathToValue(path, state);
      },

      // When recorder needs its initial state, return that here
      getInitialRecordingState: function () {
        return state.export();
      },

      // You can add any mutation methods you want here. first
      // argument is always a path array. The methods will be available
      // on the state object passed to all sync actions
      mutators: {
        set: function (path, value) {
          var key = path.pop(); // You can safely mutate the path
          state = getValue(path, state).set(key, value);
        }
      }
    };

  };

};
```

## Demos
**TodoMVC**: [www.christianalfoni.com/todomvc](http://www.christianalfoni.com/todomvc)

## Cerebral - The beginning
Read this article introducing Cerebral: [Cerebral developer preview](http://christianalfoni.com/articles/2015_05_18_Cerebral-developer-preview)

## Contributors
- **Marc Macleod**: Discussions and code contributions
- **Petter Stenberg Hansen**: Logo and illustrations
- **Jesse Wood**: Article review

Thanks guys!
