module.exports = function (type, value) {

  var types = [
    String,
    Number,
    Array,
    Object,
    Boolean
  ];

  if (type === null && value !== null) {
    return false;
  }

  if (type === undefined && value !== undefined) {
    return false;
  }

  if (type === String && typeof value !== 'string') {
    return false;
  }

  if (type === Number && typeof value !== 'number') {
    return false;
  }

  if (type === Array && !Array.isArray(value)) {
    return false;
  }

  if (type === Object && !(typeof value === 'object' && !Array.isArray(value) && value !== null)) {
    return false;
  }

  if (type === Boolean && typeof value !== 'boolean') {
    return false;
  }

  if (types.indexOf(type) === -1 && typeof type === 'function') {
    var result;
    try {
      result = type(value);
    } catch(e) {
      console.log('Type Error:', e);
    }

    if (result === undefined) return false;
    
    // tcomb returns the value if it passes so 0 and false evaluate to 
    // a return value of false, where you actually want to test for number and boolean
    if (typeof result === 'number') {
      return true;
    }
    if (typeof result === 'boolean') {
      return true;
    }
    return result;
  }

  return true;

};
