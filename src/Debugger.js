var React = require('react');
var Range = React.createFactory(require('./Range.js'));
var DOM = React.DOM;

var debuggerStyle = {
  position: 'absolute',
  fontFamily: 'Consolas, Verdana',
  fontSize: '14px',
  fontWeight: 'normal',
  right: 0,
  top: 0,
  width: '400px',
  height: '100%',
  padding: '15px',
  backgroundColor: '#333',
  color: '#666',
};

var LogLink = {
  textDecoration: 'underline',
  cursor: 'pointer'
};

var MutationsStyle = {
  listStyleType: 'none',
  color: '#999',
  paddingLeft: '10px'
};

var ActionStyle = {
  listStyleType: 'none',
  paddingLeft: 0
};

var MutationStyle = {
  marginBottom: '5px',
  paddingBottom: '5px',
  paddingLeft: '5px'
};

var MutationArgsStyle = {
  fontSize: '0.75em',
  color: '#888'
};

var mutationColors = {
  set: '#f0ad4e',
  push: '#286090',
  splice: '#d9534f',
  merge: '#5cb85c'
};

var Debugger = React.createClass({
  contextTypes: {
    cerebral: React.PropTypes.object.isRequired
  },
  componentWillMount: function() {
    this.context.cerebral.on('update', this.update);
  },
  componentWillUnmount: function() {
    this.context.cerebral.off('update', this.update);
  },
  update: function() {
    this.forceUpdate();
  },
  travelThroughTime: function(value) {
    this.context.cerebral.remember(value - 1);
  },
  logPath: function (name, path, event) {
      event.preventDefault();
      var value = this.context.cerebral.get(path);
      console.log('CEREBRAL - ' + name + ':', value.toJS ? value.toJS() : value);
  },
  renderMutations: function() {
    var currentSignalIndex = this.context.cerebral.getMemoryIndex();
    var signals = this.context.cerebral.getMemories();
    var signal = signals[currentSignalIndex];

    if (!signal) {
      return null;
    }

    return signal.actions.map(function(action, index) {
      return DOM.li({
          key: index,
          style: {
            position: 'relative',
            borderTop: '1px solid #555',
            paddingTop: '15px',
            marginTop: '15px'
          }
        },
        DOM.h3({
          style: {
            position: 'absolute',
            top: '-11px',
            left: '10px',
            backgroundColor: '#333',
            padding: '0 10px 0 10px',
            margin: 0,
            color: '#555'
          }
        }, 
        (index + 1) + '. ' + action.name,
        DOM.small({
            style: {
              color: action.isAsync ? 'orange' : '#555'
            }
          },
          action.isAsync && cerebral.hasExecutingAsyncSignals() && index === signal.actions.length - 1 ?
          ' async action running' :
          action.isAsync ? ' async' :
          null
        )),
        DOM.ul({
            style: ActionStyle
          },
          action.mutations.map(function(mutation, index) {

            var mutationArgs = mutation.args.slice();
            var path = mutation.name === 'set' ? mutation.path.concat(mutationArgs.shift()) : mutation.path;
            var color = mutationColors[mutation.name];
            var pathName = path.length ? path.join('.') : '$root';

            return DOM.li({
                key: index,
                style: MutationStyle
              },
              DOM.strong(null,
                DOM.span({
                  style: {
                    color: color
                  }
                }, mutation.name),
                ' ',
                DOM.a({style: LogLink, onClick: this.logPath.bind(null, pathName, path)}, pathName),
                DOM.div({
                  style: MutationArgsStyle
                }, mutationArgs.map(function(mutationArg) {
                  return JSON.stringify(mutationArg)
                }).join(' , '))
              )
            );

          }, this)
        )
      );
    }, this);

    var mutations = this.context.cerebral.getMemories().mutations;
    return mutations.filter(function(mutation) {
        return mutation.signalIndex === signal.index;
      })
      .map(function(mutation, index) {

      });
  },
  renderFPS: function(duration) {

    var color = duration >= 16 ? '#d9534f' : duration >= 10 ? '#f0ad4e' : '#5cb85c';
    return DOM.strong(null, DOM.small({
      style: {
        color: color
      }
    }, ' (' + duration + 'ms)'));
  },
  render: function() {
    var cerebral = this.context.cerebral;
    var lockInput = cerebral.hasExecutingAsyncSignals();
    var value = cerebral.getMemoryIndex() + 1;
    var steps = cerebral.getMemories().length;
    var currentSignalIndex = this.context.cerebral.getMemoryIndex();
    var signals = this.context.cerebral.getMemories();
    var signal = signals[currentSignalIndex];

    return DOM.div({
        style: debuggerStyle
      },
      DOM.h1(null, 'Cerebral Debugger'),
      DOM.h4(null,
        DOM.span(null, value + ' / ' + steps)
      ),
      Range({
        onChange: this.travelThroughTime,
        disabled: lockInput,
        value: value,
        steps: steps
      }),
      DOM.h2({
        style: {
          color: '#999',
          marginBottom: '25px'
        }
      }, signal ? DOM.span(null, signal.name, this.renderFPS(signal.duration)) : null),
      DOM.ul({
        style: MutationsStyle
      }, this.renderMutations())
    );
  }
});

module.exports = Debugger;
