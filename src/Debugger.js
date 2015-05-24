var React = require('react');
var DOM = React.DOM;
var mixin = require('./debugger/mixin.js');
var Toolbar = React.createFactory(require('./debugger/Toolbar.js'));
var Slider = React.createFactory(require('./debugger/Slider.js'));
var Signal = React.createFactory(require('./debugger/Signal.js'));

var debuggerStyle = {
  position: 'absolute',
  fontFamily: 'Consolas, Verdana',
  fontSize: '14px',
  fontWeight: 'normal',
  right: 0,
  top: 0,
  borderLeft: '1px solid #999',
  width: '400px',
  height: '100%',
  backgroundColor: '#FFF',
  color: '#666',
  overflowY: 'scroll',
  overflowX: 'hidden',
  boxSizing: 'border-box'
};

var Debugger = React.createClass({
  mixins: [mixin],
  getValue: function (path) {
    return this.context.cerebral.get(path);
  },
  travelThroughTime: function(value) {
    this.context.cerebral.remember(value - 1);
  },
  render: function() {

    var currentSignalIndex = this.context.cerebral.getMemoryIndex();
    var signals = this.context.cerebral.getMemories();
    var signal = signals[currentSignalIndex];

    return DOM.div({
        style: debuggerStyle
      },
      Toolbar({
        willStoreState: this.context.cerebral.willStoreState(),
        willKeepState: this.context.cerebral.willKeepState(),
        currentSignal: this.context.cerebral.getMemoryIndex() + 1,
        totalSignals: this.context.cerebral.getMemories().length,
        toggleStoreState: this.context.cerebral.toggleStoreState,
        toggleKeepState: this.context.cerebral.toggleKeepState,
        reset: this.context.cerebral.reset
      }),
      Slider({
        travelThroughTime: this.travelThroughTime,
        hasExecutingAsyncSignals: this.context.cerebral.hasExecutingAsyncSignals(),
        willKeepState: this.context.cerebral.willKeepState(),
        value: this.context.cerebral.getMemoryIndex() + 1,
        steps: this.context.cerebral.getMemories().length
      }),
      signal ? Signal({
        signal: signal, 
        getValue: this.getValue, 
        hasExecutingAsyncSignals: this.context.cerebral.hasExecutingAsyncSignals()
      }) : null
    );
  }
});

module.exports = Debugger;
