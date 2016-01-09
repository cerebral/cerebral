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
    function (args) {
      args.state.set('foo', args.input.foo);
    }
  ];

  ctrl.signals({
    'test': signal
  });
  ctrl.getRecorder().record(state);

  setTimeout(function () {
    ctrl.getSignals().test({
      foo: 'bar'
    });
    setTimeout(function () {
      ctrl.getRecorder().stop();
      test.equals(ctrl.getRecorder().getRecording().signals.length, 1);
      test.done();
    }, 100);
  }, 100);

};


exports['should play back recording'] = function (test) {

  var initialState = {};
  var state = initialState;
  var Model = function () {
    return function (controller) {
      controller.on('seek', function (seek, recording) {
        state = initialState;
      });
      return {
        accessors: {
          get: function () {
            return state;
          },
          merge: function () {
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
    function (args) {
      args.state.set('foo', args.input.foo);
    }, [function (args) {
      args.output();
    }]
  ];

  ctrl.signals({
    'test': signal
  });
  ctrl.getRecorder().record(state);

  setTimeout(function () {
    ctrl.getSignals().test({
      foo: 'bar'
    });
    setTimeout(function () {
      ctrl.getRecorder().stop();
      setTimeout(function () {
        try{
        ctrl.getRecorder().seek(0);
      } catch (e) {
        console.log(e.stack);
      }

        ctrl.getRecorder().play();
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
      controller.on('seek', function (seek, recording) {
        state = initialState;
      });
      return {
        accessors: {
          get: function () {
            return state;
          },
          merge: function () {
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
    function (args) {
      args.state.set('foo', args.input.foo);
    }
  ];

  ctrl.signals({
    'test': signal
  });
  ctrl.getRecorder().record(state);

  setTimeout(function () {
    ctrl.getSignals().test({
      foo: 'bar'
    });
    setTimeout(function () {
      ctrl.getRecorder().stop();
      setTimeout(function () {
        ctrl.getRecorder().seek(150);
        ctrl.getRecorder().play();
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
      controller.on('seek', function (seek, recording) {
        state = initialState;
      });
      return {
        accessors: {
          get: function () {
            return state;
          },
          merge: function () {
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
    function (args) {
      args.state.set('foo', args.input.foo);
    }
  ];

  ctrl.signals({
    'test': signal
  });
  ctrl.getRecorder().record(state);

  setTimeout(function () {
    ctrl.getSignals().test({
      foo: 'bar'
    });
    setTimeout(function () {
      ctrl.getSignals().test({
        foo: 'bar2'
      });

      setTimeout(function () {
        ctrl.getRecorder().stop();

        setTimeout(function () {
          ctrl.getRecorder().seek(0);
          ctrl.getRecorder().play();
          test.deepEqual(state, {});
          setTimeout(function () {
            ctrl.getRecorder().pause();
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
      controller.on('seek', function (seek, recording) {
        state = initialState;
      });
      return {
        accessors: {
          get: function () {
            return state;
          },
          merge: function () {
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
    function (args) {
      args.state.set('foo', args.input.foo);
    }
  ];

  ctrl.signals({
    'test': signal
  });
  ctrl.getRecorder().record(state);

  setTimeout(function () {
    ctrl.getSignals().test({
      foo: 'bar'
    });
    setTimeout(function () {
      ctrl.getSignals().test({
        foo: 'bar2'
      });

      setTimeout(function () {
        ctrl.getRecorder().stop();

        setTimeout(function () {
          ctrl.getRecorder().seek(0);
          ctrl.getRecorder().play();
          test.deepEqual(state, {});
          setTimeout(function () {
            ctrl.getRecorder().pause();
            test.deepEqual(state, {foo: 'bar'});

            setTimeout(function () {
              ctrl.getRecorder().seek(ctrl.getRecorder().getCurrentSeek());
              ctrl.getRecorder().play();
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
