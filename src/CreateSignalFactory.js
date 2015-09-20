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
          controller.emit('signalStart', signal);
        }

        if (recorder.isRecording()) {
          recorder.addSignal(signal);
        }

        signalStore.addSignal(signal);


        var runBranch = function (branch, index, start) {

          var currentBranch = branch[index];
          if (!currentBranch && branch === signal.branches && !signalStore.isRemembering() && !recorder.isCatchingUp()) {

             branch[index - 1].duration = Date.now() - start;
             signal.isExecuting = false;
             controller.emit('signalEnd', signal);
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
                  runBranch(action.outputs[action.outputPath], 0);
                }

              });

              runBranch(branch, index + 1);

            } else {

              controller.emit('actionStart', true);
              controller.emit('change');

              var promises = currentBranch.map(function (action) {

                var actionFunc = actions[action.actionIndex];

                if (utils.isDeveloping() && actionFunc.input) {
                  utils.verifyInput(action.name, signal.name, actionFunc.input, signalArgs);
                }

                signalStore.addAsyncAction();

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
                    var result = runBranch(action.outputs[result.path], 0, Date.now());
                    controller.emit('change');
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

            if (signalStore.isRemembering() || recorder.isPlaying()) {

              var action = currentBranch;
              action.mutations.forEach(function (mutation) {
                model.mutators[mutation.name].apply(null, [mutation.path.slice()].concat(mutation.args));
              });

              if (action.outputPath) {
                runBranch(action.outputs[action.outputPath], 0);
              }

              runBranch(branch, index + 1);

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
                } else {
                  controller.emit('actionEnd');
                  return runBranch(branch, index + 1, start);
                }

              } catch (error) {

                controller.emit('error', error);
                throw error;
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
      signalChain(true, payload);
    };

    return signalChain;

  };

};
