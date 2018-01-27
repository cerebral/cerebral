import * as React from 'react';
import { render } from 'react-dom';
import Devtools from 'cerebral/devtools';
import { Controller, Container } from '@cerebral/fluent';
import Hello from './Hello';
import app, { State, Signals } from './app';

const controller = Controller<State, Signals>(app, {
  devtools: Devtools({
    host: 'localhost:8686'
  })
});

setTimeout(
  () => {
    controller.signals.test({});
  },
  1000
);

render(
  <Container controller={controller}>
    <Hello baz="hoho" />,
  </Container>,
  document.getElementById('root')
);
