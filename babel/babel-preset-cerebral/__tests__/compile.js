/* globals describe it expect */
import {transform} from 'babel-core'
import presetCerebral from '../index'

const bableOptions = {
  babelrc: false,
  presets: [presetCerebral]
}

const bableOptionsProxies = {
  babelrc: false,
  presets: [[presetCerebral, {proxies: true}]]
}

describe('Preset transpiles cerebral specific syntax', () => {
  it('should optimize default options', () => {
    const code = `
      import {state} from 'cerebral/tags';

      state\`hello.world\`;
    `
    const {code: result} = transform(code, bableOptions)
    expect(result).toMatchSnapshot()
  })

  it('should not enable proxies by default', () => {
    const code = `
      import {state} from 'cerebral/proxies';

      state.hello.world;
    `
    const {code: result} = transform(code, bableOptions)
    expect(result).toMatchSnapshot()
  })

  it('should not transpile proxies when proxies: true', () => {
    const code = `
      import {state} from 'cerebral/proxies';

      state.hello.world;
    `
    const {code: result} = transform(code, bableOptionsProxies)
    expect(result).toMatchSnapshot()
  })

  it('should produce the same result', () => {
    const proxyCode = `
      import {state} from 'cerebral/proxies';
      state.hello.world;
    `
    const {code: proxyResult} = transform(proxyCode, bableOptionsProxies)

    const tagCode = `
      import {state} from 'cerebral/tags';
      state\`hello.world\`;
    `
    const {code: tagResult} = transform(tagCode, bableOptions)

    expect(proxyResult).toBe(tagResult)
  })
})
