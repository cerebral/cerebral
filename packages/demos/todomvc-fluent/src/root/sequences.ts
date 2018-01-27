import { Sequence } from '@cerebral/fluent';
import { Context } from '../app';
import * as actions from './actions';

export const testSequence = Sequence<Context, void>(s => s
  .action(actions.test)
);