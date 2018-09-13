'use strict'
require('raf/polyfill')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const jsdomInstance = new JSDOM(`<!doctype html><html><body></body></html>`)
global.window = jsdomInstance.window
global.document = jsdomInstance.window.document
global.navigator = { userAgent: 'node.js' }
global.CustomEvent = global.window.CustomEvent = () => {}
global.window.dispatchEvent = () => {}
