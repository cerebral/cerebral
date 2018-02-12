import * as uuid from 'uuid';
import { Provider } from '@cerebral/fluent';
import HttpProvider from '@cerebral/http';

export const id = Provider({
  create() {
    return uuid.v4();
  },
});

export const http = HttpProvider({});