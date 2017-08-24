/* eslint-env mocha */
import { compileDirectory } from './helper'

describe('TypeScript definitions for firebase', function() {
  this.timeout(15000)
  it('should compile against index.d.ts', compileDirectory)
})
