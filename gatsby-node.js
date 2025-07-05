// Load Node.js v11.10.0 compatibility polyfills first
require('./polyfill');

exports.onCreateNode = require(`./core/on-create-node`);

exports.createPages = require(`./core/create-pages`);

exports.setFieldsOnGraphQLNodeType = require('./core/set-fields-on-graphql-node-type');
