import { Context } from '../app';

export function test ({ state }: Context) {
  state.foo = 'bar2';
}