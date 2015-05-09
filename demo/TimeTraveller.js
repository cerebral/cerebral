import React from 'react';
import mixin from './../src/mixin.js';

let TimeTraveller = React.createClass({
  contextTypes: {
    cerebral: React.PropTypes.object.isRequired
  },
  getInitialState: function () {
    return {
      eventIndex: 0,
      previousSignalsLength: this.context.cerebral.getMemories().signals.length
    };
  },  
  componentWillMount: function () {
    this.context.cerebral.on('update', this.update);
  },
  componentWillUnmount: function () {
    this.context.cerebral.off('update', this.update);
  },
  update: function () {
    this.forceUpdate();
  },
   travelThroughTime: function (event) {
    this.context.cerebral.remember(event.target.value);
    this.setState({
      eventIndex: event.target.value,
      previousSignalsLength: this.context.cerebral.getMemories().signals.length
    })
  },
  renderMutations: function () {
    var currentSignalIndex = this.getCurrentSignalIndex();
    var signals = this.context.cerebral.getMemories().signals
    var currentSignal = signals[currentSignalIndex];
    var previousSignal = signals[currentSignalIndex - 1];
    var timestamp = null;
    var prevTimestamp = null;
    if (!currentSignal) {
      timestamp = Date.now();
    } else {
      timestamp = currentSignal.timestamp;
    }
    if (!previousSignal) {
      prevTimestamp = timestamp
    } else {
      prevTimestamp = previousSignal.timestamp;
    }

    if (!currentSignal && !previousSignal) {
      return null;
    }

    var mutations = this.context.cerebral.getMemories().mutations;
    return mutations.filter(function (mutation) {
      return mutation.timestamp < timestamp && mutation.timestamp >= prevTimestamp;
    })
    .map(function (mutation, index) {
      return (
        <li key={index}>
          <strong>{mutation.name} - {JSON.stringify(mutation.path)}</strong>
          <div>{JSON.stringify(mutation.args)}</div>
        </li>
      )
    })
  },
  getCurrentSignalIndex: function () {
    var currentSignalsLength = this.context.cerebral.getMemories().signals.length
    return parseInt(this.state.previousSignalsLength !== currentSignalsLength ? currentSignalsLength : this.state.eventIndex);
  },
  shouldComponentUpdate: function () {
    return true;
  },
  render: function () {
    var cerebral = this.context.cerebral;
    var lockInput = cerebral.hasExecutingAsyncSignals();
    
    return (
        <div style={{
            position: 'fixed',
            left: '20px',
            top: '20px'
          }}>
          {this.getCurrentSignalIndex() + ' / ' + cerebral.getMemories().signals.length} signals {lockInput ? ' - running async' : ''}
          <div>
        <input 
          type="range" 
          min="0"
          disabled={lockInput}
          max={cerebral.getMemories().signals.length} 
          value={this.getCurrentSignalIndex()}
          onChange={this.travelThroughTime}
        /></div>
        <ul>
        {this.renderMutations()}
        </ul>
        </div>
    );   
  }
});

export default TimeTraveller;