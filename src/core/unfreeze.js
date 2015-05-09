"use strict";

var StoreObject = require('./StoreObject.js');
var StoreArray = require('./StoreArray.js');

var unfreeze = function(value, helpers) {
  if (Array.isArray(value)) {
    return StoreArray(value, helpers);
  } else if (typeof value === 'object' && value !== null) {
    return StoreObject(value, helpers);
  } else {
    return value;
  }
};

module.exports = unfreeze;
