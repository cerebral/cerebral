import * as React from 'react';
import { connect } from './app';

export default connect<{ baz: string }>()
  .with(({ state, signals, props }) => ({
      foo: state.foo,
      runMe: signals.test
  }))
  .to(
    class Hello extends React.Component {
      render () {
        return <h1>Hello </h1>
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