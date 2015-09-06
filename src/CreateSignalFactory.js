var utils = require('./utils.js');
var createActionArgs = require('./createActionArgs.js');
var createNext = require('./createNext.js');
var analyze = require('./analyze.js');
var staticTree = require('./staticTree');
var types = require('./types.js');

var batchedSignals = [];
var pending = false;
var requestAnimationFrame = global.requestAnimationFrame || function (cb) {
  setTimeout(cb, 0);
};

module.exports = function (signalStore, recorder, devtools, controller, model, services) {

  return function () {

    var args = [].slice.call(arguments);
    var signalName = args.shift();
    var chain = args;

    if (utils.isDeveloping()) {
      analyze(signalName, chain);
    }

    var signalChain = function () {

      var tree = staticTree(signalChain.chain);
      var actions = tree.actions;

      var hasSyncArg = arguments[0] === true;
      var runSync = hasSyncArg;
      var payload = hasSyncArg ? arguments[1] : arguments[0]
      var branches = hasSyncArg ? arguments[2] : arguments[1];

      // When remembering, the branches with filled out values will be
      // passed
      branches = branches || tree.branches;

      var runSignal = function () {

        // Accumulate the args in one object that will be passed
        // to each action
        var signalArgs = payload || {};

        // Describe the signal to later trigger as if it was live
        var start = Date.now();
        var signal = {
          name: signalName,
          start: start,
          branches: branches,
          duration: 0,
          input: payload
        };

        if (recorder.isRecording()) {
          recorder.addSignal(signal);
        }
        signalStore.addSignal(signal);


        var runBranch = function (branch, index) {

          var currentBranch = branch[index];
          if (!currentBranch && branch === signal.branches && !signalStore.isRemembering() && !recorder.isCatchingUp()) {

             controller.emit('signalEnd');
             controller.emit('change');
             devtools && devtools.update();
             return;

          }

          if (!currentBranch) {
            return;
          }

          if (Array.isArray(currentBranch)) {

            if (signalStore.isRemembering() || recorder.isPlaying()) {

              currentBranch.forEach(function (action) {

                utils.merge(signalArgs, action.output);

                if (action.outputPath) {
                  return runBranch(action.outputs[action.outputPath], 0);
                } else {
                  controller.emit('actionEnd');
                  return runBranch(branch, index + 1);
                }

              });

            } else {

              controller.emit('actionStart', true);
              controller.emit('change');
              signalStore.addAsyncAction();

              var promises = currentBranch.map(function (action) {

                var actionFunc = actions[action.actionIndex];

                if (utils.isDeveloping() && actionFunc.input) {
                  utils.verifyInput(action.name, signal.name, actionFunc.input, signalArgs);
                }

                action.isExecuting = true;
                action.input = utils.merge({}, signalArgs);
                var actionArgs = createActionArgs.async(action, signalArgs, model);
                var next = createNext.async(actionFunc);
                actionFunc.apply(null, actionArgs.concat(next.fn, services));
                return next.promise.then(function (result) {

                  action.hasExecuted = true;
                  action.isExecuting = false;
                  action.output = result.arg;
                  utils.merge(signalArgs, result.arg);
                  signalStore.removeAsyncAction();
                  if (result.path) {
                    action.outputPath = result.path;
                    return runBranch(action.outputs[result.path], 0);
                  }

                  devtools && devtools.update();

                });

              });
              devtools && devtools.update();
              return Promise.all(promises)
              .then(function () {
                return runBranch(branch, index + 1);
              })
              .catch(function (error) {
                // We just throw any unhandled errors
                controller.emit('error', error);
                throw error;
              });


            }

          } else {

            controller.emit('actionStart', false);
            try {

              var action = currentBranch;
              var actionArgs = createActionArgs.sync(action, signalArgs, model);
              var actionFunc = actions[action.actionIndex];

              if (utils.isDeveloping() && actionFunc.input) {
                utils.verifyInput(action.name, signal.name, actionFunc.input, signalArgs);
              }

              action.mutations = []; // Reset mutations array
              action.input = utils.merge({}, signalArgs);

              var next = createNext.sync(actionFunc, signal.name);
              actionFunc.apply(null, actionArgs.concat(next, services));

              // TODO: Also add input here

              var result = next._result || {};
              utils.merge(signalArgs, result.arg);

              action.isExecuting = false;
              action.hasExecuted = true;
              action.output = result.arg;

              if (result.path) {
                action.outputPath = result.path;
                var result = runBranch(action.outputs[result.path], 0);
                if (result && result.then) {
                  return result.then(function () {
                    return runBranch(branch, index + 1);
                  });
                } else {
                  return runBranch(branch, index + 1);
                }
              } else {
                controller.emit('actionEnd');
                return runBranch(branch, index + 1);
              }

            } catch (error) {

              controller.emit('error', error);
              throw error;
            }

          }

        };

        runBranch(signal.branches, 0);

        return;
        /*
        var execute = function () {

          if (executionArray.length) {

            var actionFunc = executionArray.shift();

            if (utils.isDeveloping() && actionFunc.input) {
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

                while(asyncActionResults.length && asyncActionArray.length) {
                  var result = asyncActionResults.shift();
                  asyncActionArray.shift(); // Keep in sync, to extract exits
                  utils.merge(signalArgs, result.arg);
                  if (result.path) {
                    var exits = asyncActionArray.shift();
                    executionArray.splice.apply(executionArray, [0, 0].concat(Array.isArray(exits[result.path]) ? exits[result.path] : [exits[result.path]]));
                  }
                }

                execute();

              } else {

                controller.emit('actionStart', true);
                controller.emit('change');
                var currentDuration = Date.now() - start;
                signal.duration = signal.duration > currentDuration ? signal.duration : currentDuration;
                signalStore.addAsyncAction();

                // Use to track the output of an action
                var actionOutputTracker = [];
                Promise.all(asyncActionArray.map(function (actionFunc) {
                  if (utils.isAction(actionFunc)) {
                    var actionArgs = createActionArgs.async(signal.actions, signalArgs, model);
                    var action = {
                      name: utils.getFunctionName(actionFunc),
                      duration: 0,
                      mutations: [],
                      output: null,
                      path: null,
                      isAsync: true
                    };
                    signal.actions.push(action);
                    actionOutputTracker.push(action);

                    if (typeof actionFunc !== 'function') {
                      throw new Error('Cerebral - There is something wrong with the chain in signal "' + signalName + '". Please verify outputs and that async signals are defined within an array.');
                    }

                    var next = createNext.async(actionFunc);
                    actionFunc.apply(null, actionArgs.concat(next.fn, services));
                    return next.promise;
                  } else {
                    return actionFunc;
                  }

                }))
                  .then(function (results) {

                    while(results.length) {
                      var result = results.shift();
                      var action = actionOutputTracker.shift();
                      signal.asyncActionResults.push(result);
                      action.output = result.arg;
                      utils.merge(signalArgs, result.arg);
                      if (result.path) {
                        var exits = results.shift();
                        action.path = result.path;
                        executionArray.splice.apply(executionArray, [0, 0].concat(Array.isArray(exits[result.path]) ? exits[result.path] : [exits[result.path]]));
                      }
                    }
                    signalStore.removeAsyncAction();
                    start = Date.now();
                    controller.emit('actionEnd');
                    execute();

                  })
                  .catch(function (error) {
                    // We just throw any unhandled errors
                    controller.emit('error', error);
                    throw error;
                  });

                devtools && devtools.update();

              }

            } else {

              controller.emit('actionStart', false);
              try {

                var actionArgs = createActionArgs.sync(signal.actions, signalArgs, model);
                var action = {
                  name: utils.getFunctionName(actionFunc),
                  duration: 0,
                  isParallell: false,
                  mutations: [],
                  output: null,
                  isAsync: false
                };
                signal.actions.push(action);

                if (typeof actionFunc !== 'function') {
                  throw new Error('Cerebral - There is something wrong with the chain in signal "' + signalName + '". Please verify outputs and that async signals are defined within an array.');
                }

                var next = createNext.sync(actionFunc, signal.name);
                actionFunc.apply(null, actionArgs.concat(next, services));

                var result = next._result || {};
                utils.merge(signalArgs, result.arg);

                action.output = result.arg;

                if (result.path) {
                  var exits = executionArray.shift();
                  action.path = result.path;
                  executionArray.splice.apply(executionArray, [0, 0].concat(exits[result.path]));
                }
                controller.emit('actionEnd');
                execute();

              } catch (error) {
                controller.emit('error', error);
                throw error;
              }

            }

          } else if (!signalStore.isRemembering() && !recorder.isCatchingUp()) {

            controller.emit('signalEnd');
            controller.emit('change');
            var currentDuration = Date.now() - start;
            signal.duration = signal.duration > currentDuration ? signal.duration : currentDuration;
            devtools && devtools.update();

          }

        };

        execute();
        */
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

    signalChain.chain = chain;

    return signalChain;

  };

};
