module.exports = function(arg) {
  [
    require('./on-create-mdx-documents'),
    require('./on-create-config-yaml'),
  ].forEach(_ => _(arg));
};
