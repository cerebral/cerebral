const defineTest = require('jscodeshift/dist/testUtils').defineTest

defineTest(__dirname, 'computed', null, 'computed')
defineTest(__dirname, 'computed', null, 'computed-decorator')
