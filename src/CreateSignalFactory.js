var utils = require('./utils.js');
var createActionArgs = require('./createActionArgs.js');

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

    return function (payload, asyncActionResults) {

      var executionArray = actions.slice();

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

            if (Array.isArray(actionFunc)) {

              var asyncActionArray = actionFunc;
              var actionFuncs = asyncActionArray.filter(function (action) {
                return typeof action === 'function';
              });
              var path = asyncActionArray[asyncActionArray.length - 1];

              if (signalStore.isRemembering() || recorder.isPlaying()) {

                result = asyncActionResults.shift();

                utils.merge(signalArgs, result.result);

                if (utils.isPathObject(path) && (result.resolved ? path.resolve : path.reject)) {
                  executionArray.splice.apply(executionArray, [0, 0].concat((result.resolved ? path.resolve : path.reject)));
                }

                execute();

              } else {

                options.onUpdate && options.onUpdate();

                signalStore.addAsyncAction();
                Promise.all(actionFuncs.map(function (actionFunc) {

                  var actionArgs = createActionArgs.async(signal.actions, signalArgs, options);
                  var action = {
                    name: utils.getFunctionName(actionFunc),
                    isParallell: actionFuncs.length > 1,
                    duration: 0,
                    mutations: [],
                    isAsync: true
                  };
                  signal.actions.push(action);

                  return new Promise(function (resolve, reject) {

                    actionFunc.apply(null, actionArgs.concat({
                      resolve: resolve,
                      reject: reject
                    }));

                  });

                }))
                  .then(function (results) {
                    var result = results.reduce(function (allResults, result) {
                      utils.merge(allResults, result);
                      return allResults;
                    }, {});
                    signalStore.removeAsyncAction();
                    signal.asyncActionResults.push({
                      resolved: true,
                      result: result
                    });
                    utils.merge(signalArgs, result);

                    if (utils.isPathObject(path) && path.resolve) {
                      executionArray.splice.apply(executionArray, [0, 0].concat(path.resolve));
                    }

                    execute();

                  })
                  .catch(function (result) {
                    signalStore.removeAsyncAction();
                    signal.asyncActionResults.push({
                      resolved: false,
                      result: result
                    });
                    utils.merge(signalArgs, result);

                    if (utils.isPathObject(path) && path.reject) {
                      executionArray.splice.apply(executionArray, [0, 0].concat(path.reject));
                    }

                    execute();
                  });

                devtools && devtools.update();

              }

            } else {

              var actionArgs = createActionArgs.sync(signal.actions, signalArgs, options);
              var action = {
                name: utils.getFunctionName(actionFunc),
                duration: 0,
                isParallell: false,
                mutations: [],
                isAsync: false
              };
              signal.actions.push(action);
              var result = actionFunc.apply(null, actionArgs);
              utils.merge(signalArgs, result);
              execute();

            }

          } else if (!signalStore.isRemembering() && !recorder.isCatchingUp()) {

            options.onUpdate && options.onUpdate();
            devtools && devtools.update();

          }

        };

        execute();

      };

      if (signalStore.isRemembering() || recorder.isCatchingUp()) {
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
