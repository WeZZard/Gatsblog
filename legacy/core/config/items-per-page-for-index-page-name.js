const debug = require('debug');

module.exports = async (indexName, graphql) => {
  const {
    data: { configYaml },
  } = await graphql(`
    {
      configYaml {
        pagination {
          indexName
          itemsPerPage
        }
      }
    }
  `);

  const { pagination } = configYaml || { pagination: [] };

  const filteredPagination = pagination.filter(_ => _.indexName === indexName);

  if (filteredPagination.length === 0) {
    debug(
      `No pagination config with the index name "${indexName}" was found. Returns 8 by default.`,
    );
    return 8;
  } else {
    if (filteredPagination.length > 1) {
      debug(
        `Multiple pagination config with the index name "${indexName}" were found: ${filteredPagination}. Returns the first one.`,
      );
    }
    return filteredPagination[0].itemsPerPage;
  }
};
