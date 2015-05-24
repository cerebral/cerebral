var React = require('react');
var DOM = React.DOM;
var Range = React.createFactory(require('./Range.js'));

var SliderStyle = {
  padding: '10px',
  borderBottom: '1px solid #EEE',
  height: '40px',
  boxSizing: 'border-box'
};

var Slider = React.createClass({
  render: function() {
    return DOM.div({
        style: SliderStyle
      },
      Range({
        onChange: this.props.travelThroughTime,
        disabled: this.props.hasExecutingAsyncSignals || !this.props.willKeepState,
        value: this.props.value,
        steps: this.props.steps
      })
    )
  }
});

module.exports = Slider;
