# Cerebral [![Build Status](https://travis-ci.org/christianalfoni/cerebral.svg?branch=master)](https://travis-ci.org/christianalfoni/cerebral)
A state controller with its own debugger

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/christianalfoni/cerebral?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

<img src="images/logo.png" width="300" align="center">

## The Cerebral Webpage is now launched
You can access the webpage at [http://christianalfoni.com/cerebral/](http://christianalfoni.com/cerebral/). You will find all the information you need there.

- [How to create a custom Cerebral VIEW package](#how-to-create-a-custom-cerebral-view-package)
- [How to create a custom Cerebral MODEL package](#how-to-create-a-custom-cerebral-model-package)

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

      // When the debugger logs out the model it calls this
      // function. It should return an immutable version of the
      // state
      toJSON: function () {
        return state.toJS();
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
