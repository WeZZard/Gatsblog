// Wrapper for object-assign to match the expected interface of object.assign/polyfill
// The assert package expects require('object.assign/polyfill')() to return the polyfill
module.exports = function() {
  return require('object-assign');
};