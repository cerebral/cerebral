var React = require('react');

module.exports = {
  contextTypes: {
    cerebral: React.PropTypes.object.isRequired
  },
  componentWillMount: function() {
    this.context.cerebral.on('eventStoreUpdate', this.update);
    this.context.cerebral.on('update', this.update);
  },
  componentDidMount: function () {
    this.isMounted = true;
  },
  componentWillUnmount: function() {
    console.log('Unmounting');
    this.isMounted = false;
    this.context.cerebral.removeListener('eventStoreUpdate', this.update);
    this.context.cerebral.removeListener('update', this.update);
  },
  update: function() {
    if (this.isMounted) {
      this.forceUpdate();
    }
  },
};
