module.exports = function(arg) {
  [
    require('./on-create-mdx-documents'),
    require('./on-create-config-yml'),
  ].forEach(_ => _(arg));
};
