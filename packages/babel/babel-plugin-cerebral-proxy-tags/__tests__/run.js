/* globals describe it expect  */
import { transform } from 'babel-core'
import { Tag } from 'cerebral/tags'
import plugin from '../index'

const pluginOptions = {
  babelrc: false,
  presets: ['es2015'],
  plugins: [plugin],
}

describe('Run transformed proxies', () => {
  it('should evaluate to a tag', () => {
    const code = `
      import {state} from 'cerebral/proxies';
      state.hello.world;
    `
    const { code: result } = transform(code, pluginOptions)
    expect(eval(result)).toMatchSnapshot() // eslint-disable-line no-eval
  })

  it('should evaluate to a tag with nested tags', () => {
    const code = `
      import {state, input} from 'cerebral/proxies';
      state.a[input.b];
    `

    const getters = {
      state: {
        a: {
          c: 'Working!',
        },
      },
      input: {
        b: 'c',
      },
    }
    const { code: result } = transform(code, pluginOptions)
    const tag = eval(result) // eslint-disable-line no-eval
    expect(tag).toMatchSnapshot()
    expect(tag).toBeInstanceOf(Tag)
    expect(tag.getValue(getters)).toEqual(getters.state.a.c)
  })

  it('should allow to access with expressions in ${}', () => {
    const code = `
      import {state} from 'cerebral/proxies';

      const name = 'c';

      state.a[name][1+1];
    `

    const getters = {
      state: {
        a: {
          c: {
            2: 'Working!',
          },
        },
      },
    }
    const { code: result } = transform(code, pluginOptions)
    const tag = eval(result) // eslint-disable-line no-eval
    expect(tag).toBeInstanceOf(Tag)
    expect(tag.getValue(getters)).toEqual(getters.state.a.c[2])
  })
})
