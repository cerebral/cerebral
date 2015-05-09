'use strict';

var utils = require('./../utils.js');

function StoreArray(items) {
  var inst = Array.apply(Array);
  inst = inst.concat(items);
  inst.__proto__ = StoreArray.prototype;
  return inst;
}
StoreArray.prototype = Object.create(Array.prototype);
StoreArray.prototype.push = function(item) {
  return this.__.update(this.__.path, function(obj, helpers, traverse) {
    helpers.currentPath.push(obj.length);
    Array.prototype.push.call(obj, traverse(helpers, item));
    helpers.currentPath.pop();
  });
};
StoreArray.prototype.splice = function() {
  var args = [].slice.call(arguments, 0);
  var startIndex = args.shift();
  startIndex = startIndex < 0 ? 0 : startIndex;
  var count = args.shift();

  return this.__.update(this.__.path, function(obj, helpers, traverse) {

    var additions = args.map(function(arg, index) {
      helpers.currentPath.push(startIndex + index);
      var addition = traverse(helpers, arg);
      helpers.currentPath.pop();
      return addition;
    });

    Array.prototype.splice.apply(obj, [startIndex, count].concat(additions));

    // Update paths
    for (var x = startIndex; x < obj.length; x++) {
      if (obj[x].__) {
        var path = obj[x].__.path;
        path[path.length - 1] = x;
      }
    }

  });
};
StoreArray.prototype.concat = function() {
  var args = [].slice.call(arguments, 0);
  return this.__.update(this.__.path, function(obj, helpers, traverse) {
    args.map(function(arg) {
      if (Array.isArray(arg)) {
        arg.map(function(deepArg) {
          helpers.currentPath.push(obj.length);
          Array.prototype.push.call(obj, traverse(helpers, deepArg));
          helpers.currentPath.pop();
        });
      } else {
        helpers.currentPath.push(obj.length);
        Array.prototype.push.call(obj, traverse(helpers, arg));
        helpers.currentPath.pop();
      }
    });
  });
};
StoreArray.prototype.unshift = function(item) {
  return this.__.update(this.__.path, function(obj, helpers, traverse) {
    Array.prototype.unshift.call(obj, traverse(helpers, item));

    // Update paths
    for (var x = 0; x < obj.length; x++) {
      if (obj[x].__) {
        var path = obj[x].__.path;
        path[path.length - 1] = x;
      }
    }

  });
};
StoreArray.prototype.shift = function(item) {
  return this.__.update(this.__.path, function(obj, helpers, traverse) {
    Array.prototype.shift.call(obj, traverse(helpers, item));

    // Update paths
    for (var x = 0; x < obj.length; x++) {
      if (obj[x].__) {
        var path = obj[x].__.path;
        path[path.length - 1] = x;
      }
    }

  });
};
StoreArray.prototype.pop = function() {
  return this.__.update(this.__.path, function(obj) {
    Array.prototype.pop.call(obj);
  });
};
StoreArray.prototype.toJS = function() {
  return utils.toJS(this);
};


module.exports = function(items, helpers) {
  var array = new StoreArray(items);
  Object.defineProperty(array, '__', {
    value: {
      path: helpers.currentPath.slice(0),
      update: helpers.update
    }
  });
  return array;
};
