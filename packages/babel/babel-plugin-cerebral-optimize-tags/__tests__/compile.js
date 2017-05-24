/* globals describe it expect */
import {transform} from 'babel-core'
import plugin from '../index'

const pluginOptions = {
  babelrc: false,
  plugins: [plugin]
}

describe('Transform tags to constructor calls', () => {
  it('should transforms simple proxies', () => {
    const code = `
      import {state} from 'cerebral/tags';
      const otherTag = () => {};
      otherTag\`hello.world\`;

      state\`hello.world\`;
    `
    const {code: result} = transform(code, pluginOptions)
    expect(result).toMatchSnapshot()
  })

  it('should ignore variable when shadowed', () => {
    const code = `
      import {state} from 'cerebral/tags';
      (state) => state.notChanged();
    `
    const {code: result} = transform(code, pluginOptions)
    expect(result).toMatchSnapshot()
  })

  it('should allow imported variable to be renamed', () => {
    const code = `
      import {state as anotherName} from 'cerebral/tags';
      (state) => anotherName\`hello.\${anotherName\`world\`}\`;
    `
    const {code: result} = transform(code, pluginOptions)
    expect(result).toMatchSnapshot()
  })

  it('should throw when import is not allowed', () => {
    const code = `
      import {wrongImport} from 'cerebral/tags';
    `
    expect(() => {
      transform(code, pluginOptions)
    }).toThrowErrorMatchingSnapshot()
  })

  it('should ignore default imports', () => {
    const code = `
      import state from 'cerebral/tags';
      state.hello.world;
    `
    const {code: result} = transform(code, pluginOptions)
    expect(result).toMatchSnapshot()
  })
})
