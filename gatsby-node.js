// Polyfill for globalThis (Node.js v11.10.0 compatibility)
if (typeof globalThis === 'undefined') {
  if (typeof global !== 'undefined') {
    global.globalThis = global;
  } else if (typeof window !== 'undefined') {
    window.globalThis = window;
  } else if (typeof self !== 'undefined') {
    self.globalThis = self;
  } else {
    throw new Error('Unable to locate global object');
  }
}

exports.onCreateNode = require(`./core/on-create-node`);

exports.createPages = require(`./core/create-pages`);

exports.setFieldsOnGraphQLNodeType = require('./core/set-fields-on-graphql-node-type');
