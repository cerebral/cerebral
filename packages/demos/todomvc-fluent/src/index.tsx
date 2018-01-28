import * as React from 'react';
import { render } from 'react-dom';
import Devtools from 'cerebral/devtools';
import { Controller, Container } from '@cerebral/fluent';
import App from './components/App';
import module from './module';

const controller = Controller(module, {
  devtools: Devtools({
    host: 'localhost:8686'
  })
});

render(
  <Container controller={controller}>
    <App />,
  </Container>,
  document.getElementById('root')
);
