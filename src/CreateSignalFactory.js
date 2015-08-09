var utils = require('./utils.js');
var createActionArgs = require('./createActionArgs.js');
var createNext = require('./createNext.js');
var analyze = require('./analyze.js');
var types = require('./types.js');

var batchedSignals = [];
var pending = false;
var requestAnimationFrame = global.requestAnimationFrame || function (cb) {
  setTimeout(cb, 0);
};

module.exports = function (signalStore, recorder, devtools, options) {

  return function () {

    var args = [].slice.call(arguments);
    var signalName = args.shift();
    var actions = args;

    analyze(signalName, actions);

    return function () {

      var executionArray = actions.slice();
      var hasSyncArg = arguments[0] === true;
      var runSync = hasSyncArg;
      var payload = hasSyncArg ? arguments[1] : arguments[0]
      var asyncActionResults = hasSyncArg ? arguments[2] : arguments[1];

      var runSignal = function () {

        // Accumulate the args in one object that will be passed
        // to each action
        var signalArgs = payload || {};

        // Describe the signal to later trigger as if it was live
        var signal = {
          name: signalName,
          actions: [],
          duration: 0,
          start: Date.now(),
          payload: payload,
          asyncActionResults: []
        };

        if (recorder.isRecording()) {
          recorder.addSignal(signal);
        }
        signalStore.addSignal(signal);

        var execute = function () {

          if (executionArray.length) {

            var actionFunc = executionArray.shift();

            if (actionFunc.input) {
              Object.keys(actionFunc.input).forEach(function (key) {
                if (typeof signalArgs[key] === 'undefined' || !types(actionFunc.input[key], signalArgs[key])) {
                  throw new Error([
                    'Cerebral: You are giving the wrong input to the action "' +
                    utils.getFunctionName(actionFunc) + '" ' +
                    'in signal "' + signal.name + '". Check the following prop: "' + key + '"'
                  ].join(''));
                }
              });
            }

            if (Array.isArray(actionFunc)) {

              var asyncActionArray = actionFunc.slice();

              if (signalStore.isRemembering() || recorder.isPlaying()) {

                while(asyncActionResults.length) {
                  var result = asyncActionResults.shift();
                  asyncActionArray.shift(); // Keep in sync, to extract exits
                  utils.merge(signalArgs, result.arg);
                  if (result.path) {
                    var exits = asyncActionArray.shift();
                    executionArray.splice.apply(executionArray, [0, 0].concat(exits[result.path]));
                  }
                }

                execute();

              } else {

                options.onUpdate && options.onUpdate();
                signalStore.addAsyncAction();
                Promise.all(asyncActionArray.map(function (actionFunc) {

                  if (utils.isAction(actionFunc)) {
                    var actionArgs = createActionArgs.async(signal.actions, signalArgs, options);
                    var action = {
                      name: utils.getFunctionName(actionFunc),
                      duration: 0,
                      mutations: [],
                      isAsync: true
                    };
                    signal.actions.push(action);

                    var next = createNext.async(actionFunc);
                    actionFunc.apply(null, actionArgs.concat(next.fn));
                    return next.promise;
                  } else {
                    return actionFunc;
                  }

                }))
                  .then(function (results) {

                    while(results.length) {
                      var result = results.shift();
                      signal.asyncActionResults.push(result);
                      utils.merge(signalArgs, result.arg);
                      if (result.path) {
                        var exits = results.shift();
                        executionArray.splice.apply(executionArray, [0, 0].concat(exits[result.path]));
                      }
                    }
                    signalStore.removeAsyncAction();
                    execute();

                  })
                  .catch(function (error) {
                    // We just throw any unhandled errors
                    options.onError && options.onError(error);
                    throw error;
                  });

                devtools && devtools.update();

              }

            } else {

              try {

                var actionArgs = createActionArgs.sync(signal.actions, signalArgs, options);
                var action = {
                  name: utils.getFunctionName(actionFunc),
                  duration: 0,
                  isParallell: false,
                  mutations: [],
                  isAsync: false
                };
                signal.actions.push(action);

                var next = createNext.sync(actionFunc, signal.name);
                actionFunc.apply(null, actionArgs.concat(next));

                var result = next._result || {};
                utils.merge(signalArgs, result.arg);

                if (result.path) {
                  var exits = executionArray.shift();
                  executionArray.splice.apply(executionArray, [0, 0].concat(exits[result.path]));
                }
                execute();

              } catch (error) {
                options.onError && options.onError(error);
                throw error;
              }

            }

          } else if (!signalStore.isRemembering() && !recorder.isCatchingUp()) {

            options.onUpdate && options.onUpdate();
            devtools && devtools.update();

          }

        };

        execute();

      };

      if (runSync || signalStore.isRemembering() || recorder.isCatchingUp()) {
        runSignal();
      } else {

        batchedSignals.push(runSignal);

        if (!pending) {

          requestAnimationFrame(function () {

            while (batchedSignals.length) {
              batchedSignals.shift()();
            }
            pending = false;

          });

          pending = true;

        }

      }

    };

  };

};
