var utils = require('./utils.js');
module.exports = function (signalName, actions) {
  var traverse = function (actions, parentActions, parentIndex) {
    actions.forEach(function (action, index) {

      if (typeof action === 'undefined') {
        throw new Error([
          'Cerebral: Action number "' + index + '" in signal "' + signalName +
          '" does not exist. Check that you have spelled it correctly!'
        ].join(''));
      }

      if (Array.isArray(action)) {
        traverse(action, actions, index);
      } else {
        var nextPaths = actions[index + 1];
        if (
          action.output &&
          (
            (parentActions && typeof nextPaths === 'function') ||
            (!parentActions && (typeof nextPaths !== 'function' || !nextPaths)) ||
            (parentActions && typeof parentActions[parentIndex + 1] !== 'function')
          )
        ) {
          throw new Error([
            'Cerebral: The action "' + utils.getFunctionName(action) +
            '" in signal "' + signalName +  '" has an output definition, but there is ' +
            'no action to receive it. ' +
            (nextPaths ? 'But there are ' + JSON.stringify(Object.keys(nextPaths)) + ' paths, should it be outputs?': '')
          ].join(''));

        } else if (action.outputs && (!nextPaths || typeof nextPaths === 'function')) {

          throw new Error([
            'Cerebral: The action "' + utils.getFunctionName(action) +
            '" in signal "' + signalName +  '" has an output value. ' +
            'There should be these paths: ' + JSON.stringify(Array.isArray(action.outputs) ? action.outputs : Object.keys(action.outputs))
          ].join(''));

        } else if (Array.isArray(action.outputs)) {

          var nextPaths = actions[index + 1];
          action.outputs.forEach(function (output) {
            if (!Array.isArray(nextPaths[output])) {
              throw new Error([
                'Cerebral: The action "' + utils.getFunctionName(action) +
                '" in signal "' + signalName +  '" can not find path to its "' +
                output + '" output'
              ].join(''));
            }
          });

        } else if (action.outputs) {

          Object.keys(action.outputs).forEach(function (output) {
            if (!Array.isArray(nextPaths[output])) {
              throw new Error([
                'Cerebral: The action "' + utils.getFunctionName(action) +
                '" in signal "' + signalName +  '" can not find path to its "' +
                output + '" output'
              ].join(''));
            }
          });

        } else if (!Array.isArray(action) && typeof action === 'object' && typeof action !== null) {
          var prevAction = actions[index - 1];
          Object.keys(action).forEach(function (key) {
            if (!Array.isArray(action[key])) {
              throw new Error([
                'Cerebral: The paths for action "' + utils.getFunctionName(prevAction) +
                '" in signal "' + signalName +  '" are not valid. They have to be an array"'
              ].join(''));
            }
          })
        }
      }

    });
  }
  traverse(actions);
};
