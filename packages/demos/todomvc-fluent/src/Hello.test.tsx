import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Hello from './Hello';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Hello baz="moh" />, div);
});
