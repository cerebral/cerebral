var React = require('react');
var Range = React.createFactory(require('./Range.js'));
var DOM = React.DOM;

var debuggerStyle = {
  position: 'absolute',
  fontFamily: 'Monospace, Verdana',
  fontWeight: 'normal',
  right: 0,
  top: 0,
  width: '400px',
  height: '100%',
  padding: '15px',
  backgroundColor: '#333',
  color: '#666',
};

var MutationsStyle = {
  listStyleType : 'none',
  color: '#999',
  paddingLeft: 0
};

var MutationStyle = {
  marginBottom: '5px',
  paddingBottom: '5px',
  borderBottom: '1px dashed #444'
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
  renderMutations: function() {
    var currentSignalIndex = this.context.cerebral.getMemoryIndex();
    var signals = this.context.cerebral.getMemories().signals
    var signal = signals[currentSignalIndex];

    if (!signal) {
      return null;
    }

    var mutations = this.context.cerebral.getMemories().mutations;
    return mutations.filter(function(mutation) {
        return mutation.signalId === signal.id;
      })
      .map(function(mutation, index) {
        var mutationArgs = mutation.args.slice();
        var path = mutation.name === 'set' ? mutation.path.concat(mutationArgs.shift()) : mutation.path;
        var color = mutationColors[mutation.name];

        return DOM.li({
          key: index,
          style: MutationStyle
        },
          DOM.strong(null, 
            DOM.span({style: {color: color}}, mutation.name), 
            ' ' + path.join('.'),
            DOM.div({style: MutationArgsStyle}, mutationArgs.map(function (mutationArg) {
              return JSON.stringify(mutationArg)
            }).join(' , '))
          )
        );
      });
  },
  render: function() {
    var cerebral = this.context.cerebral;
    var lockInput = cerebral.hasExecutingAsyncSignals();
    var value = cerebral.getMemoryIndex() + 1;
    var steps = cerebral.getMemories().signals.length;
    var currentSignalIndex = this.context.cerebral.getMemoryIndex();
    var signals = this.context.cerebral.getMemories().signals
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
      DOM.h2({style:{color: '#999'}}, signal ? signal.name + ':' : null),
      DOM.ul({style: MutationsStyle}, this.renderMutations()),
      lockInput ? DOM.strong({
        style: {color: 'orange'}
      }, 'Async running...') : null
    );
  }
});

module.exports = Debugger;
