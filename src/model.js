var StateTree = require('state-tree');

var Model = function (initialState, options) {

  options = options || {};

  var tree = new StateTree(initialState);

  var model = function (controller) {

    controller.on('change', function () {
      controller.emit('flush', tree.flushChanges());
    });

    controller.on('seek', function (seek, recording) {
      recording.initialState.forEach(function (state) {
        tree.set(state.path, state.value);
      });
    });

    return {
        logModel: function () {
          return tree.get();
        },
        accessors: {
          get: function (path) {
            return tree.get(path);
          },
          toJSON: function () {
            return JSON.parse(JSON.stringify(tree.get()));
          },
          toJS: function (path) {
            return tree.get(path);
          },
          export: function () {
            return tree.get();
          },
          keys: function (path) {
            return Object.keys(tree.get(path));
          },
          findWhere: function (path, obj) {
            var keysCount = Object.keys(obj).length;
            return tree.get(path).filter(function (item) {
              return Object.keys(item).filter(function (key) {
                return key in obj && obj[key] === item[key];
              }).length === keysCount;
            }).pop();
          }
        },
        mutators: {
          set: function (path, value) {
            tree.set(path, value);
          },
          import: function (newState) {
            tree.import(newState);
          },
          unset: function (path, keys) {
            if (keys) {
              keys.forEach(function (key) {
                tree.unset(path.concat(key));
              })
            } else {
              tree.unset(path);
            }
          },
          push: function (path, value) {
            tree.push(path, value);
          },
          splice: function () {
            var args = [].slice.call(arguments);
            tree.splice.apply(tree, [args.shift()].concat(args));
          },
          merge: function (path, value) {
            tree.merge(path, value);
          },
          concat: function () {
            tree.concat.apply(tree, arguments);
          },
          pop: function (path) {
            tree.pop(path);
          },
          shift: function (path) {
            tree.shift(path);
          },
          unshift: function (path, value) {
            tree.unshift(path, value);
          }
        }
    };

  };

  return model;

};

module.exports = Model;
