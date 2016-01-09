var utils = require('./utils.js');
var createActionArgs = require('./createActionArgs.js');
var createNext = require('./createNext.js');
var analyze = require('./analyze.js');
var staticTree = require('./staticTree');
var types = require('./types.js');
var createModulesArg = require('./createModulesArg.js');

var batchedSignals = [];
var pending = false;
var requestAnimationFrame = global.requestAnimationFrame || function (cb) {
  setTimeout(cb, 0);
};

module.exports = function (signalStore, recorder, devtools, controller, model, services, compute, modules) {

  return function () {

    var args = [].slice.call(arguments);
    var signalName = args.shift();
    var defaultOptions = args[1] || {};
    defaultOptions.modulePath = defaultOptions.modulePath || [];

    var chain = args[0] || [];

    if (utils.isDeveloping()) {
      analyze(signalName, chain);
    }

    var signalChain = function (payload, options) {

      if (
        utils.isDeveloping() &&
        !signalStore.isRemembering() &&
        signalStore.getCurrentIndex() !== -1 &&
        signalStore.getCurrentIndex() < signalStore.getSignals().length - 1
      ) {
        console.warn('Cerebral - Looking in the past, ignored signal ' + signalName);
        return;
      }

      options = options || {};

      if (recorder.isPlaying() && !options.isRecorded) {
        return;
      }

      var tree = staticTree(signalChain.chain);
      var actions = tree.actions;

      var runSync = defaultOptions.isSync || options.isSync;

      // When remembering, the branches with filled out values will be
      // passed
      var branches = options.branches || tree.branches;
      var runSignal = function () {

        // Accumulate the args in one object that will be passed
        // to each action
        var signalArgs = payload || {};

        // Test payload
        if (utils.isDeveloping()) {
          try {
            JSON.stringify(signalArgs);
          } catch (e) {
            console.log('Not serializable', signalArgs);
            throw new Error('Cerebral - Could not serialize input to signal. Please check signal ' + signalName);
          }
        }

        // Describe the signal to later trigger as if it was live
        var start = Date.now();
        var recorderSignal = {
          name: signalName,
          input: payload,
          start: start,
          asyncActionPaths: [],
          asyncActionResults: []
        };
        var signal = {
          name: signalName,
          start: start,
          isSync: runSync,
          isExecuting: true,
          branches: branches,
          duration: 0,
          input: payload
        };

        if (!signalStore.isRemembering() && !recorder.isCatchingUp()) {
          controller.emit('signalStart', {signal: signal});
        }

        if (recorder.isRecording()) {
          recorder.addSignal(recorderSignal);
        }

        signalStore.addSignal(signal);

        var runBranch = function (branch, index, start) {

          var currentBranch = branch[index];
          if (!currentBranch && branch === signal.branches && !signalStore.isRemembering() && !recorder.isCatchingUp()) {

             // Might not be any actions passed
             if (branch[index - 1]) {
                branch[index - 1].duration = Date.now() - start;
             }

             signal.isExecuting = false;
             controller.emit('signalEnd', {signal: signal});
             controller.emit('change', {signal: signal});
             devtools && devtools.update();
             return;

          }

          if (!currentBranch) {
            return;
          }

          if (Array.isArray(currentBranch)) {

            if (signalStore.isRemembering()) {

              currentBranch.forEach(function (action) {

                utils.merge(signalArgs, action.output);

                if (action.outputPath) {
                  runBranch(action.outputs[action.outputPath], 0);
                }

              });

              runBranch(branch, index + 1);

            } else if (recorder.isCatchingUp()) {

              var currentSignal = recorder.getCurrentSignal();
              currentBranch.forEach(function (action) {
                var recordedAction = currentSignal.asyncActionResults[currentSignal.asyncActionPaths.indexOf(action.path.join('.'))];
                utils.merge(signalArgs, recordedAction.output);

                if (action.outputPath) {
                  runBranch(action.outputs[recordedAction.outputPath], 0);
                }

              });

              runBranch(branch, index + 1);

            } else {

              controller.emit('change', {signal: signal});

              var promises = currentBranch.map(function (action) {

                controller.emit('actionStart', {action: action, signal: signal});
                var actionFunc = actions[action.actionIndex];
                var inputArg = actionFunc.defaultInput ? utils.merge({}, actionFunc.defaultInput, signalArgs) : signalArgs;
                var actionArgs = createActionArgs.async(action, inputArg, model, compute);

                if (utils.isDeveloping() && actionFunc.input) {
                  utils.verifyInput(action.name, signal.name, actionFunc.input, inputArg);
                }

                signalStore.addAsyncAction();

                action.isExecuting = true;
                action.input = utils.merge({}, inputArg);
                var next = createNext.async(actionFunc);
                var modulesArg = createModulesArg(modules, actionArgs[1], services);
                actionFunc.call(null, {
                  input: actionArgs[0],
                  state: actionArgs[1],
                  output: next.fn,
                  services: services,
                  modules: modulesArg,
                  module: defaultOptions.modulePath.reduce(function (modules, key) {
                    return modules[key];
                  }, modulesArg)
                });

                return next.promise.then(function (result) {

                  action.hasExecuted = true;
                  action.isExecuting = false;
                  action.output = result.arg;
                  utils.merge(signalArgs, result.arg);
                  signalStore.removeAsyncAction();

                  if (recorder.isRecording()) {
                    recorderSignal.asyncActionPaths.push(action.path.join('.'));
                    recorderSignal.asyncActionResults.push({
                      output: result.arg,
                      outputPath: result.path
                    });
                  }

                  if (result.path) {
                    action.outputPath = result.path;
                    controller.emit('actionEnd', {action: action, signal: signal});
                    var result = runBranch(action.outputs[result.path], 0, Date.now());
                    controller.emit('change', {signal: signal});
                    devtools && devtools.update();
                    return result;
                  } else {
                    devtools && devtools.update();
                  }

                });

              });
              devtools && devtools.update();
              return Promise.all(promises)
              .then(function () {
                return runBranch(branch, index + 1, Date.now());
              })
              .catch(function (error) {
                // We just throw any unhandled errors
                controller.emit('error', error);
                throw error;
              });


            }

          } else {
            if (signalStore.isRemembering()) {

              var action = currentBranch;
              action.mutations.forEach(function (mutation) {
                model.mutators[mutation.name].apply(null, [mutation.path.slice()].concat(mutation.args));
              });

              if (action.outputPath) {
                runBranch(action.outputs[action.outputPath], 0);
              }

              runBranch(branch, index + 1);

            } else {

              var action = currentBranch;
              controller.emit('actionStart', {action: action, signal: signal});
              var actionFunc = actions[action.actionIndex];
              var inputArg = actionFunc.defaultInput ? utils.merge({}, actionFunc.defaultInput, signalArgs) : signalArgs;
              var actionArgs = createActionArgs.sync(action, inputArg, model, compute);

              if (utils.isDeveloping() && actionFunc.input) {
                utils.verifyInput(action.name, signal.name, actionFunc.input, inputArg);
              }

              action.mutations = []; // Reset mutations array
              action.input = utils.merge({}, inputArg);

              var next = createNext.sync(actionFunc, signal.name);
              var modulesArg = createModulesArg(modules, actionArgs[1], services);
              actionFunc.call(null, {
                input: actionArgs[0],
                state: actionArgs[1],
                output: next,
                services: services,
                modules: modulesArg,
                module: defaultOptions.modulePath.reduce(function (exportedModule, key) {
                  return exportedModule[key];
                }, modulesArg)
              });

              // TODO: Also add input here

              var result = next._result || {};
              utils.merge(signalArgs, result.arg);

              action.isExecuting = false;
              action.hasExecuted = true;
              action.output = result.arg;

              if (!branch[index + 1] || Array.isArray(branch[index + 1])) {
                action.duration = Date.now() - start;
              }

              if (result.path) {
                action.outputPath = result.path;
                var result = runBranch(action.outputs[result.path], 0, start);
                if (result && result.then) {
                  return result.then(function () {
                    return runBranch(branch, index + 1, Date.now());
                  });
                } else {
                  return runBranch(branch, index + 1, start);
                }
              } else if (result.then) {
                return result.then(function () {
                  controller.emit('actionEnd', {action: action, signal: signal});
                  return runBranch(branch, index + 1, start);
                });
              } else {
                controller.emit('actionEnd', {action: action, signal: signal});
                return runBranch(branch, index + 1, start);
              }

            }

          }

        };

        runBranch(signal.branches, 0, Date.now());

        return;

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
    signalChain.sync = function (payload) {
      signalChain(payload, {isSync: true});
    };
    signalChain.signalName = signalName;

    return signalChain;

  };

};
