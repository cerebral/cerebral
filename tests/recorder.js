var Controller = require('./../src/index.js');
var async = function (cb) {
  setTimeout(cb, 0);
};
var Model = function () {
  return function () {
    return {
      accessors: {
        get: function () {

        }
      },
      mutators: {
        set: function (path, value) {
          state = {};
          state[path.pop()] = value;
        }
      }
    }
  };
};

exports['should record signals'] = function (test) {

  var initialState = {};
  var state = initialState;
  var ctrl = Controller(Model());
  var signal = [
    function (args, state) {
      state.set('foo', args.foo);
    }
  ];

  ctrl.signal('test', signal);
  ctrl.recorder.record(state);

  setTimeout(function () {
    ctrl.signals.test({
      foo: 'bar'
    });
    setTimeout(function () {
      ctrl.recorder.stop();
      test.equals(ctrl.recorder.getRecording().signals.length, 1);
      test.done();
    }, 100);
  }, 100);

};


exports['should play back recording'] = function (test) {

  var initialState = {};
  var state = initialState;
  var Model = function () {
    return function (controller) {
      controller.on('seek', function (seek, startPlaying, currentRecording) {
        state = currentRecording.initialState;
      });
      return {
        accessors: {
          export: function () {
            return state;
          }
        },
        mutators: {
          set: function (path, value) {
            state = {};
            state[path.pop()] = value;
          }
        }
      }
    };
  };
  var ctrl = Controller(Model());
  var signal = [
    function (input, state) {
      state.set('foo', input.foo);
    }, [function (input, state, output) {
      output();
    }]
  ];

  ctrl.signal('test', signal);
  ctrl.recorder.record(state);

  setTimeout(function () {
    ctrl.signals.test({
      foo: 'bar'
    });
    setTimeout(function () {
      ctrl.recorder.stop();
      setTimeout(function () {
        ctrl.recorder.seek(0, true);
        test.deepEqual(state, {});
        setTimeout(function () {
          test.deepEqual(state, {foo: 'bar'});
          test.done();
        }, 300);
      }, 100);
    }, 100);
  }, 100);

};


exports['should seek to specific point in recording'] = function (test) {

  var initialState = {};
  var state = initialState;
  var Model = function () {
    return function (controller) {
      controller.on('seek', function (seek, startPlaying, currentRecording) {
        state = currentRecording.initialState;
      });
      return {
        accessors: {
          export: function () {
            return state;
          }
        },
        mutators: {
          set: function (path, value) {
            state = {};
            state[path.pop()] = value;
          }
        }
      }
    };
  };
  var ctrl = Controller(Model());
  var signal = [
    function (args, state) {
      state.set('foo', args.foo);
    }
  ];

  ctrl.signal('test', signal);
  ctrl.recorder.record(state);

  setTimeout(function () {
    ctrl.signals.test({
      foo: 'bar'
    });
    setTimeout(function () {
      ctrl.recorder.stop();
      setTimeout(function () {
        ctrl.recorder.seek(150);
        test.deepEqual(state, {foo: 'bar'});
        test.done();
      }, 100);
    }, 100);
  }, 100);

};


exports['should pause a playback'] = function (test) {

  var initialState = {};
  var state = initialState;
  var Model = function () {
    return function (controller) {
      controller.on('seek', function (seek, startPlaying, currentRecording) {
        state = currentRecording.initialState;
      });
      return {
        accessors: {
          export: function () {
            return state;
          }
        },
        mutators: {
          set: function (path, value) {
            state = {};
            state[path.pop()] = value;
          }
        }
      }
    };
  };
  var ctrl = Controller(Model());
  var signal = [
    function (args, state) {
      state.set('foo', args.foo);
    }
  ];

  ctrl.signal('test', signal);
  ctrl.recorder.record(state);

  setTimeout(function () {
    ctrl.signals.test({
      foo: 'bar'
    });
    setTimeout(function () {
      ctrl.signals.test({
        foo: 'bar2'
      });

      setTimeout(function () {
        ctrl.recorder.stop();

        setTimeout(function () {
          ctrl.recorder.seek(0, true);
          test.deepEqual(state, {});
          setTimeout(function () {
            ctrl.recorder.pause();
            test.deepEqual(state, {foo: 'bar'});
            test.done();
          }, 150);
        }, 100);

      }, 100);

    }, 100);
  }, 100);

};

exports['should resume a paused playback'] = function (test) {

  var initialState = {};
  var state = initialState;
  var Model = function () {
    return function (controller) {
      controller.on('seek', function (seek, startPlaying, currentRecording) {
        state = currentRecording.initialState;
      });
      return {
        accessors: {
          export: function () {
            return state;
          }
        },
        mutators: {
          set: function (path, value) {
            state = {};
            state[path.pop()] = value;
          }
        }
      }
    };
  };
  var ctrl = Controller(Model());
  var signal = [
    function (args, state) {
      state.set('foo', args.foo);
    }
  ];
  
  ctrl.signal('test', signal);
  ctrl.recorder.record(state);

  setTimeout(function () {
    ctrl.signals.test({
      foo: 'bar'
    });
    setTimeout(function () {
      ctrl.signals.test({
        foo: 'bar2'
      });

      setTimeout(function () {
        ctrl.recorder.stop();

        setTimeout(function () {
          ctrl.recorder.seek(0, true);
          test.deepEqual(state, {});
          setTimeout(function () {
            ctrl.recorder.pause();
            test.deepEqual(state, {foo: 'bar'});

            setTimeout(function () {
              ctrl.recorder.seek(ctrl.recorder.getCurrentSeek(), true);
              setTimeout(function () {
                test.deepEqual(state, {foo: 'bar2'});
                test.done();
              }, 100);
            }, 100);

          }, 150);
        }, 100);

      }, 100);

    }, 100);
  }, 100);

};
