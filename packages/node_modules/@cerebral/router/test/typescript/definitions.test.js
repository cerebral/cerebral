/* eslint-env mocha */
import { compileDirectory } from './helper'

describe('TypeScript definitions for router', function() {
  this.timeout(15000)
  it('should compile against index.d.ts', compileDirectory)
})
