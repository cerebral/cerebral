import * as React from 'react';
import { connect } from './app';

export default connect<{ baz: string }>()
  .with(({ state, signals, props }) => ({
      foo: state.foo,
      runMe: signals.test
  }))
  .to(function Hello ({ foo, baz, runMe }) {
    return <h1>Hello there! {baz}</h1>;
  });