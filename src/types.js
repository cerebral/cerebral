var typeDetect = require('type-detect');


var typeToTypeDetect = {}
typeToTypeDetect[String] = 'string'
typeToTypeDetect[Number] = 'number'
typeToTypeDetect[Array] = 'array'
typeToTypeDetect[Object] = 'object'
typeToTypeDetect[Boolean] = 'boolean'


module.exports = function (type, value) {

  if (typeToTypeDetect.hasOwnProperty(type)) {
    return typeDetect(value) === typeToTypeDetect[type]
  }
  if (typeDetect(type) === 'function') {
    return type(value)
  }

  // Right now we return `true` if the type passed in was not one we knew
  // about and not a function.
  return true;
};
