var React = require('react');
var DOM = React.DOM;
var Mutation = React.createFactory(require('./Mutation.js'));

var ActionStyle = {
  position: 'relative',
  boxSizing: 'border-box'
};

var ActionHeaderStyle = {
  padding: '3px 10px',
  backgroundColor: '#FCFCFC',
  margin: 0,
  height: '20px',
  color: '#888',
  fontSize: '1em',
  borderTop: '1px solid #EEE',
  borderBottom: '1px solid #EEE'
};

var MutationsStyle = {
  listStyleType: 'none',
  paddingLeft: 0
};

var Action = React.createClass({
  renderMutation: function (mutation, index) {
    return Mutation({
      mutation: mutation, 
      index: index, 
      action: this.props.action, 
      key: index,
      getValue: this.props.getValue
    });
  },
  render: function() {
    return DOM.li({
        style: ActionStyle
      },
      DOM.h3({
          style: ActionHeaderStyle
        }, (this.props.index + 1) + '. ', this.props.action.name,
        DOM.small({
            style: {
              color: this.props.action.isAsync ? 'orange' : '#555'
            }
          },
          this.props.action.isAsync &&
          this.props.hasExecutingAsyncSignals &&
          this.props.index === this.props.signal.actions.length - 1 ?
          ' async action running' :
          this.props.action.isAsync ? ' async' :
          null
        )
      ),
      DOM.ul({
        style: MutationsStyle
      }, this.props.action.mutations.map(this.renderMutation))
    )
  }
});

module.exports = Action;
