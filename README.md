# cerebral - redefined ![build status](https://travis-ci.org/christianalfoni/cerebral.svg?branch=master)
A state controller with its own debugger

<img src="images/logo.jpg" width="300" align="center">

## Cerebral scope is redefined
To my surprise a lot of the feedback on React was its signaling implementation. Though it being an important concept in giving Cerebral its state control capabilities, it proves to also be a very good way to define the state flow of your application.

This fact led me to change the scope. Cerebral is now a standalone "controller" implementation. It sits between the UI and the STATE STORE of your application. On one side you define signals and actions. On the other side you define "mutation hooks". This gives Cerebral all it needs to understand the complete state flow of your application and give you some pretty cool tools to help develop complex applications.

The Cerebral Core API is a bit "low level", but extremely flexible. It is possible to build "plug`n`play" versions like "cerebral-react-baobab", "cerebral-angular-immutable-store" etc. to get packages that already has hooks and event emitting defined.

## The API

### Define a Controller
To define a Controller you need somewhere to store your state. You can use whatever you want in this regard, but to gain the full power of the developer tools the state store should be immutable. This specifically allows you to move back and forth in time in the debugger and you will gain benefits in rendering optimization.

In this example we will use the [immutable-store]() project as a state store, but [freezer](), [baobab](), [immutable-js]() are also good alternatives.

*controller.js*
```js
import {Controller, Value} from 'cerebral';
import Store from 'immutable-store';
import eventHub from './eventHub.js';
import ajax from 'ajax';

// First we define our initial state
let initialState = Store({
  inputValue: '',
  todos: []
});

// Then we define our current state, which initially is
// the initial state
let state = initialState;

export default Controller({

  // All actions will receive an args object as first argument.
  // You can add default args like different utilities etc.
  defaultArgs: {
    utils: {
      ajax: ajax
    }
  },

  // When Cerebral wants to reset the state, we have to
  // define a method for handling that
  onReset: function () {
    state = initialState;
  },

  // Whenever a signal is done or triggers an async action  it is likely that you want
  // to update your UI. We do this with an event in this example
  onUpdate: function () {
    eventHub.emit('change', state);
  },

  // Actions exposes a get method to grab state, this hook
  // retrieves that state. The path is always an array
  onGet: function (path) {
    return Value(state, path);
  },

  // Actions also exposes methods to mutate state. There
  // are multiple hooks, though you decide which ones to use
  onSet: function (path, value) {
    const key = path.pop();
    state = Value(state, path).set(key, value);
  },
  onPush: function (path, value) {
    state = Value(state, path).push(value);
  },
  onUnset: ...,
  onSplice: ...,
  onConcat: ...,
  onShift: ...,
  onUnshift: ...,
  onPop: ...,
});
```

### Define a signal
When the wiring of state change and updates are set you can start to define the signals.

*main.js*
```js
import controller from './controller.js';

controller.signal('appMounted');

controller.signals.appMounted();
```

### Define actions
Though signals does not do much without some actions.

*main.js*
```js
import controller from './controller.js';

// All actions receives two arguments. The First are
// arguments passed when the signal is triggered and any
// values returned by a sync action or resolved/rejected by
// an async action
const setLoading = function setLoading (args, state) {
  args.foo; // "bar"
  state.set('isLoading', true);
};

controller.signal('appMounted', setLoading);

controller.signals.appMounted({
  foo: 'bar'
});
```

### Async actions
Any action defined can become an async action. Defining arrays in signals indicates that the actions included should run async. The action will not get a third argument to resolve or reject.

```js
const setLoading = function setLoading (args, state) {
  state.set('isLoading', true);
};

const loadUser = function loadUser (args, state, promise) {
  args.utils.ajax.get('/user').then(function (user) {
    promise.resolve({
      user: data
    });
  }).catch(function (errorMessage) {
    promise.reject({
      error: errorMessage
    });
  });
};

const setUser = function setUser (args, state) {
  state.set('user', args.user);
};

const setError = function setError (args, state) {
  state.set('error', args.error);
};

const unsetLoading = function unsetLoading (args, state) {
  state.set('isLoading', false);
};

controller.signal('appMounted',

  setLoading,

  // The array indicates the action being run async. You can have
  // multiple async actions in the array and they will run in
  // parallell. The last entry in the array can be an object with
  // two properties, "resolve" and "reject". Depending on the result
  // of the promise either the resolve or reject actions will run
  [loadUser, {
      resolve: [setUser],
      reject: [setError]
  }],

  // This action will run after loadUser and either setUser or
  // setError has run
  unsetLoading
);

controller.signals.appMounted();
```

### Pure actions
As we know from functional programming pure functions are great! By passing any utils you need as "default args" your actions becomes pure, they being sync or async. This is great for testing! Just pass in a fake args object, fake state object and optionally a fake promise object, and verify that the action triggers the methods with the correct arguments.

## Demos
**TodoMVC**: [www.christianalfoni.com/todomvc](http://www.christianalfoni.com/todomvc)

## Cerebral - The beginning
Read this article introducing Cerebral: [Cerebral developer preview](http://christianalfoni.com/articles/2015_05_18_Cerebral-developer-preview)

## Contributors
- Discussions and code contributions - **Marc**
- Logo and illustrations - **Petter Stenberg Hansen**
- Article review - **Jesse Wood**

Thanks guys!
