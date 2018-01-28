import * as React from 'react';
import { connect } from './app';

var result = connect<{ baz: string }>()
  .with(({ state, signals, props }) => ({
      foo: state.foo,
      runMe: signals.test
  }));

export default result.to(
  class Hello extends React.Component<typeof result.type> {
    render () {
      return (
        <div>
          <h1>Hello {this.props.foo}</h1>
          <button onClick={e => this.props.runMe()}>Click me</button>
        </div>
      );
    }
  }
);

  /*
    function Hello ({ foo, runMe }) {
      return <h1>Hello</h1>
    }
    class Hello extends React.Component {
      render () {
        return <h1>Hello </h1>
      }
    }
  */