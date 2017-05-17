/* globals describe it expect */
import {transform} from 'babel-core'
import plugin from '../index'

const pluginOptions = {
  babelrc: false,
  plugins: [plugin]
}

describe('Transform proxies to template tags', () => {
  it('should transforms simple proxies', () => {
    const code = `
      import {state} from 'cerebral/proxies';
      state.hello.world;
    `
    const {code: result} = transform(code, pluginOptions)
    expect(result).toMatchSnapshot()
  })

  it('should allow nested tags should work', () => {
    const code = `
      import {state} from 'cerebral/proxies';
      state.hello[state.world];
    `
    const {code: result} = transform(code, pluginOptions)
    expect(result).toMatchSnapshot()
  })

  it('should ignore variable when shadowed', () => {
    const code = `
      import {state} from 'cerebral/proxies';
      (state) => state.hello[state.world];
    `
    const {code: result} = transform(code, pluginOptions)
    expect(result).toMatchSnapshot()
  })

  it('should allow imported variable to be renamed', () => {
    const code = `
      import {state as anotherName} from 'cerebral/proxies';
      (state) => anotherName.hello[anotherName.world];
    `
    const {code: result} = transform(code, pluginOptions)
    expect(result).toMatchSnapshot()
  })

  it('should throw when import is not allowed', () => {
    const code = `
      import {wrongImport} from 'cerebral/proxies';
    `
    expect(() => {
      transform(code, pluginOptions)
    }).toThrowErrorMatchingSnapshot()
  })

  it('should support expression in property accessor', () => {
    const code = `
      import {state} from 'cerebral/proxies';
      state.a[1+1]
    `
    const {code: result} = transform(code, pluginOptions)
    expect(result).toMatchSnapshot()
  })

  it('should not do anything when cerebral/proxies is not imported', () => {
    const code = `
      import {state} from 'other-module';
      state.hello.world;
    `
    const {code: result} = transform(code, pluginOptions)
    expect(result).toMatchSnapshot()
  })

  it('should work for cerebral-proxy-tags too', () => {
    const code = `
      import {state} from 'cerebral-proxy-tags';
      state.hello.world;
    `
    const {code: result} = transform(code, pluginOptions)
    expect(result).toMatchSnapshot()
  })

  it('should allow for string access', () => {
    const code = `
      import {state} from 'cerebral/proxies';
      state.a['b']
    `
    const {code: result} = transform(code, pluginOptions)
    expect(result).toMatchSnapshot()
  })

  it('should allow access to variables', () => {
    const code = `
      import {state} from 'cerebral/proxies';
      const a = 'a';
      const b = 'b'
      state.a[a+b]
    `
    const {code: result} = transform(code, pluginOptions)
    expect(result).toMatchSnapshot()
  })

  it('should ignore default imports', () => {
    const code = `
      import state from 'cerebral/proxies';
      state.hello.world;
    `
    const {code: result} = transform(code, pluginOptions)
    expect(result).toMatchSnapshot()
  })
})
