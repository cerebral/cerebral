var React = require('react');
var CerebralDebugger = React.createFactory(require('./../Debugger.js'));
var utils = require('./../utils.js');

module.exports = function(cerebral, helpers) {
  return function(component) {

    // Set store in correct state
    try {
      helpers.eventStore.rememberNow(helpers.currentState);
    } catch (e) {
      helpers.eventStore.reset(helpers.currentState);
      alert('Cerebral was unable to remember your state, probably due to an incompatible change in the code. State has been reset and application will reload!')
      return location.reload();

    }

    var Wrapper = React.createClass({
      childContextTypes: {
        cerebral: React.PropTypes.object
      },
      getInitialState: function() {
        var showDebugger = utils.hasLocalStorage() && localStorage.getItem('cerebral_showDebugger');
        return {
          showDebugger: showDebugger ? JSON.parse(showDebugger) : true
        }
      },
      getChildContext: function() {
        return {
          cerebral: cerebral
        };
      },
      toggleDebugger: function() {
        if (cerebral.willKeepState()) {
          cerebral.toggleKeepState();
        }
        var showDebugger = !this.state.showDebugger;
        this.setState({
          showDebugger: showDebugger
        });
        if (utils.hasLocalStorage()) {
          localStorage.setItem('cerebral_showDebugger', JSON.stringify(showDebugger));
        }
      },
      render: function() {

        if (process.env.NODE_ENV === 'production') {
          return React.createElement(component, this.props);
        } else {
          return React.DOM.div(null,
            React.DOM.div({
              style: {
                paddingRight: this.state.showDebugger ? '400px' : '0'
              }
            }, React.createElement(component, this.props)),
            this.state.showDebugger ?
            CerebralDebugger({
              toggleDebugger: this.toggleDebugger
            }) :
            React.DOM.div({
              onClick: this.toggleDebugger,
              style: {
                position: 'absolute',
                top: 0,
                cursor: 'pointer',
                right: 0,
                height: '30px',
                fontWeight: 'bold',
                backgroundColor: '#EEE',
                borderLeft: '1px solid #DDD',
                borderRight: '1px solid #DDD',
                borderBottom: '1px solid #DDD',
                textAlign: 'center',
                color: '#666',
                lineHeight: '20px',
                zIndex: '9999999999',
                fontFamily: 'Consolas, Verdana',
                fontSize: '16px',
                padding: '5px 10px 5px 5px',
                boxSizing: 'border-box'
              }
            }, '◀')
          );
        }
      }
    });

    return Wrapper;
  };
};
