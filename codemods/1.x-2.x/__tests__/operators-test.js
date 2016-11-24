'use strict'
jest.autoMockOff()
const defineTest = require('jscodeshift/dist/testUtils').defineTest

defineTest(__dirname, 'operators', null, 'operators-state')
defineTest(__dirname, 'operators', null, 'operators-flow')
