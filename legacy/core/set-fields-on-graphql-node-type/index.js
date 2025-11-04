module.exports = async args => {
  let object = {};

  const partial = await Promise.all(
    [
      require('./set-fields-on-graphql-node-type-post'),
      require('./set-fields-on-graphql-node-type-mdx-protocol'),
    ].map(async current => current(args)),
  );

  partial.forEach(each => Object.assign(object, each));

  return object;
};
