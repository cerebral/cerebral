import * as React from 'react';
import { render } from 'react-dom';
import { Controller, Container } from '@cerebral/fluent';
import Hello from './Hello';
import app from './app';

const controller = Controller(app);

render(
  <Container controller={controller}>
    <Hello baz="hoho" />,
  </Container>,
  document.getElementById('root')
);
