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
    return type(value);
  }

  return true;

};
