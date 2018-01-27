import * as React from 'react';
import { render } from 'react-dom';
import Devtools from 'cerebral/devtools';
import { Controller, Container } from '@cerebral/fluent';
import Hello from './Hello';
import root from './root';

const controller = Controller(root, {
  devtools: Devtools({
    host: 'localhost:8686'
  })
});

render(
  <Container controller={controller}>
    <Hello baz="hoho" />,
  </Container>,
  document.getElementById('root')
);
