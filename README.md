# Cerebral ![build status](https://travis-ci.org/christianalfoni/cerebral.svg?branch=master)
A state controller with its own debugger

<img src="images/logo.jpg" width="300" align="center">

- [What is Cerebral?](#what-is-cerebral)
- [Grab the Chrome Debugger](#grab-the-chrome-debugger)
- [Cerebral packages](#cerebral-packages)
- [How to use Cerebral with an existing package](#how-to-use-cerebral-with-an-existing-package)
  - [Instantiate a controller](#instantiate-a-controller)
  - [Creating actions and signals](#creating-actions-and-signals)
  - [Trigger a signal](#trigger-a-signal)
  - [Get initial state](#get-initial-state)
  - [Get state updates](#get-state-updates)
  - [Mutations](#mutations)
  - [Get state in actions](#get-state-in-actions)
  - [Async actions](#async-actions)
  - [Recording](#recording)
- [How to create a custom Cerebral package](#how-to-create-a-custom-cerebral-package)

## What is Cerebral?
To get a more complete introduction, [watch this video on Cerebral](). But to give you a quick overview, imagine your application in three parts. Your VIEW layer, your MODEL layer and smack in the middle, the CONTROLLER layer. The VIEW layer has historically had very few changes to its concept, though technically they have become a lot more effective.

If you are familiar with a Backbone View with a template or an Angular Controller/Directive with a template, that is pretty much how a VIEW works. The more recent React js VIEW (component) library is much the same concept in regards of being responsbile for rendering HTML based on STATE inside the VIEW, but it does it in a radically different way that is a lot faster.

The traditional MODEL layer of your app, like Backbone Model or Angular Resource, are wrappers for your database entities. To make it easier to communicate changes back and forth to the server. This has changed radically the last year. Instead of thinking the MODEL layer as wrapped objects that allows for easier communication, it is now just one big plain object containing any data/state your application needs, it being a database entity or just some state indicating that your application is loading, show a modal etc.

The CONTROLLER layer is the most loosely defined concept on the frontend. On the backend the CONTROLLER in MVC starts with your router. It is what receives a request from the client and moves it through middleware which often communicates with the MODEL layer to create a response. Since we also have a concept of a router on the frontend I believe it has been a bit confusing how all of this should fit together.

With Cerebral the CONTROLLER layer of your application has nothing to do with the router. Routing is just state changes, like anything else. Instead the CONTROLLER is responsible to move a request from the UI, called a signal, through middlewares, called actions, to make changes to the state of the application. When a signal is done running it can respond to the UI that it needs to update, most commonly with an even, passing the new state of the application.

What makes Cerebral so special is the way it tracks signals and state mutations. It does not matter what you VIEW layer or MODEL layer is, you hook them on to the CONTROLLER on each side and off you go. The Chrome Debugger will help you analyze and control the state flow as you develop the app. This is a very powerful concept that makes it very easy to scale, reuse code and reduce development time.

## Grab the Chrome debugger
[Cerebral Debugger](https://chrome.google.com/webstore/detail/cerebral-debugger/ddefoknoniaeoikpgneklcbjlipfedbb)

## Cerebral packages
The Cerebral Core API is "low level", but extremely flexible. You can check out a few packages here that will instantly get you started with some of your favorite development tools:

- [cerebral-react-immutable-store](https://github.com/christianalfoni/cerebral-react-immutable-store)
- cerebral-angular-immutable-store
- cerebral-react-baobab
- cerebral-jquery-immutable-store
- cerebral-react-immutable-js

## How to use Cerebral with an existing package

### Instantiate a Controller
```js
import Controller from 'cerebral-some-package';

// Define a single object representing all the base state
// of your application
const state = {
  foo: 'bar'
};

// Define an optional object with utils etc. you want to
// pass into each action. Typically ajax libs etc.
const defaultArgs = {
  foo: 'bar'
};

// Instantiate the controller
const controller = Controller(state, defaultArgs);
```

### Creating actions and signals
Actions is where it all happens. This is where you define mutations to your application state based on information sent from the VIEW layer. Actions are pure functions that can run synchronously and asynchronously. They are easily reused across signals and can easily be tested.

```js
const controller = Controller(state, defaultArgs);

// Define an action with a function. It receives two arguments when run
// synchronously
const setLoading = function setLoading (args, state) {
  state.set('isLoading', true);
};

// There are many types of mutations you can do, "set" is just one of them
const unsetLoading = function unsetLoading (args, state) {
  state.set('isLoading', false);
};

// When an action is run asynchronously it receives a third argument,
// a promise you can either resolve or reject. In this example we
// are using an ajax util we passed as a default argument and an argument
// we passed when the signal was triggered
const saveForm = function saveForm (args, state, promise) {
  args.utils.ajax.post('/form', args.formData, function (err, response) {
    promise.resolve();
  });
};

// The saveForm action runs async because it is in an array. You can have multiple
// actions in one array that runs async in parallell.
controller.signal('formSubmitted', setLoading, [saveForm], unsetLoading);
```

### Trigger a signal
Depending on the package being used the controller needs to be exposed to the VIEW layer. This allows you to trigger a signal.

```js
controller.signals.formSubmitted({
  formData: {foo: 'bar'}
});
```

### Get initial state
When running the application you need to grab the initial state of the application. You can do this with the exposed "get" method.

```js
const state = controller.get(); // Returns all state
state.isLoading // false
```

### Get state updates
Depending on the package you are using you will get state updates. This might for example be an event triggered on the controller.

```js
controller.on('update', function (state) {
  state.isLoading // false
});
```

### Mutations
You can do any traditional mutation to the state, the signature is just a bit different. You call the kind of mutation first, then the path and then an optional value. The path can either be a string or an array for nested paths.
```js
const someAction = function someAction (args, state) {
  state.set('isLoading', false);
  state.unset('isLoading');
  state.merge('user', {name: 'foo'});
  state.push('list', 'foo');
  state.unshift('list', 'bar');
  state.pop('list');
  state.shift('list');
  state.concat('list', [1, 2, 3]);
  state.splice('list', 1, 1, [1]);

  state.push(['admin', 'users'], {foo: 'bar'});

};
```

### Get state in actions
```js
const someAction = function someAction (args, state) {
  const isLoading = state.get('isLoading');
};
```

### Async actions
```js
const someAction = function someAction (args, state, promise) {
  args.utils.ajax('/foo', function (err, result) {
    if (err) {
      promise.reject({error: err});
    } else {
      promise.resolve({result: result});
    }
  })
};
```
You can optionally redirect resolved and rejected async actions to different actions by inserting an object as the last entry in the async array definition.
```js
controller.signal('formSubmitted',
  setLoading,
  [saveForm, {
    resolve: [closeModal],
    reject: [setFormError]
  }],
  unsetLoading
);
```

### Recording
With the Cerebral controller you can record and replay state changes.
```js
// Start recording by passing the initial state of the recording
controller.recorder.record(controller.get());

// Stop recording
controller.recorder.stop();

// Seek to specific time and optionally start playback
controller.recorder.seek(0, true);
```

## How to create a custom Cerebral package

To define a Controller you need somewhere to store the state. You can use whatever you want in this regard, but to gain the full power of the developer tools the state store should be immutable. This specifically allows you to move back and forth in time in the debugger and you will gain benefits in rendering optimization.

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

    // We trigger a change event and passing the current state
    onUpdate: function () {
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
