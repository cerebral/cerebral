import * as React from 'react';
import { connect } from '@cerebral/fluent';
import { Connector } from './app';

export default connect(
  ({ state, props }: Connector<{ baz: string }>) => ({
    foo: state.foo
  }),
  function Hello ({ foo, baz }) {
    return <h1>Hello there! {foo}</h1>;
  }
);