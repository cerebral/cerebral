import * as uuid from 'uuid';
import { Provider } from '@cerebral/fluent';
import Router from '@cerebral/router';

export const id = Provider({
  create() {
    return uuid.v4();
  },
});

export const router = Router({
  onlyHash: true,
  query: true,
  routes: [
    { path: '/', signal: 'rootRouted' },
    { path: '/:filter', signal: 'filterClicked' },
  ],
});
