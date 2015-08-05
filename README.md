# Cerebral ![build status](https://travis-ci.org/christianalfoni/cerebral.svg?branch=master)
A state controller with its own debugger

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/christianalfoni/cerebral?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

<img src="images/logo.jpg" width="300" align="center">

- [What is Cerebral?](#what-is-cerebral)
- [How to get started](#how-to-get-started)
- [How to create a custom Cerebral package](#how-to-create-a-custom-cerebral-package)

## What is Cerebral?
To get an understanding of Cerebral I suggest you choose your preferred media:

- [watch this video on Cerebral](https://www.youtube.com/watch?v=xCIv4-Q2dtA)
- [read this article on why you might need Cerebral](http://www.christianalfoni.com/articles/2015_08_02_Why-we-are-doing-MVC-and-FLUX-wrong)
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
Depending on the package you choose you instantiate and create signals differently. Please continue with the README of the specific package you choose

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
