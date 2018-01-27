import * as React from 'react';
import { connect } from './app';

export default connect<{ baz: string }>()
  .with(({ state, props }) => ({
      foo: state.foo
  }))
  .to(function Hello (context) {
    return <h1>Hello there! {context.baz}</h1>;
  });