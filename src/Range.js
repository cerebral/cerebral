var React = require('react');
var DOM = React.DOM;

var RangeStyle = {
  position: 'relative',
  border: '1px solid #555',
  borderRadius: '2px',
  backgroundColor: '#444',
  height: '10px',
  margin: '0 10px 0 10px'
};

var NodeStyle = {
  position: 'relative',
  display: 'inline-block',
  width: '20px',
  height: '20px',
  top: '-6px',
  borderRadius: '3px',
  backgroundColor: '#5bc0de',
  border: '2px solid #46b8da',
  boxSizing: 'border-box',
  cursor: 'pointer'
};

var Range = React.createClass({
  getInitialState: function() {
    return {
      left: 0,
      startLeft: 0,
      endLeft: 0,
      isHoveringNode: false,
      stepInterval: 0,
      currentStep: 0
    };
  },
  componentDidMount: function() {
    this.setMaxLeft();
    this.calculateSteps(this.props.steps, this.props.value);
  },
  componentWillUpdate: function (nextProps) {
    if (!this.maxLeft) {
      this.setMaxLeft();
    }
    if (this.props.steps !== nextProps.steps || this.props.value !== nextProps.value) {
      this.calculateSteps(nextProps.steps, nextProps.value);
    }
  },
  componentWillMount: function() {
    window.addEventListener('mousedown', this.startTracking);
    window.addEventListener('mouseup', this.endTracking);
    window.addEventListener('mousemove', this.trackMouse);
  },
  componentWillUnmount: function() {
    window.removeEventListener('mousedown', this.startTracking);
    window.removeEventListener('mouseup', this.endTracking);
    window.removeEventListener('mousemove', this.trackMouse);
  },
  setMaxLeft: function () {
    this.maxLeft = this.refs.range ? this.refs.range.getDOMNode().offsetWidth : 0;
  },
  setHovering: function() {
    this.setState({
      isHoveringNode: true
    });
  },
  unsetHovering: function() {
    this.setState({
      isHoveringNode: false
    });
  },
  startTracking: function(event) {
    if (this.props.disabled) {
      return;
    }
    if (this.refs.node && event.target === this.refs.node.getDOMNode()) {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      this.setState({
        doTrack: true,
        startLeft: event.clientX - this.state.endLeft
      });
    }
  },
  endTracking: function() {
    if (this.state.doTrack) {
      document.body.style.userSelect = 'auto';
      document.body.style.webkitUserSelect = 'auto';
      this.setState({
        doTrack: false,
        endLeft: this.state.left
      });
    }
  },
  trackMouse: function(event) {
    if (this.state.doTrack) {
      var left = event.clientX - this.state.startLeft;
      var currentStep = Math.round(left / this.state.stepInterval);
      if (currentStep !== this.state.currentStep && currentStep >= 0 && currentStep <= this.props.steps) {
        this.props.onChange(currentStep);
      }
      this.setState({
        left: left >= 0 && left <= this.maxLeft ? left : this.state.left,
        currentStep: currentStep
      });
    }
  },
  calculateSteps: function(steps, value) {
    var stepInterval = this.maxLeft / steps;
    var left = stepInterval * value;
    this.setState({
      stepInterval: stepInterval,
      left: left,
      currentStep: value,
      endLeft: left
    });
  },
  render: function() {
    NodeStyle.left = (this.state.left - 10) + 'px';
    if (this.state.isHoveringNode) {
      NodeStyle.backgroundColor = '#31b0d5';
    } else {
      NodeStyle.backgroundColor = '#5bc0de';
    }
    if (this.props.disabled) {
      NodeStyle.backgroundColor = '#444';
      NodeStyle.border = '1px solid #555';
      NodeStyle.cursor = 'default';
    } else {
      NodeStyle.cursor = 'pointer';
    }
    if (!this.props.steps) {
      return DOM.div(null, 'No signals detected');
    }
    return DOM.div({
      ref: 'range',
      style: RangeStyle
    }, DOM.div({
      ref: 'node',
      onMouseOver: this.setHovering,
      onMouseOut: this.unsetHovering,
      style: NodeStyle
    }))
  }
});

module.exports = Range;
