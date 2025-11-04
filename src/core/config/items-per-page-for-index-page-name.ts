interface PaginationConfig {
  indexName: string;
  itemsPerPage: number;
}

interface ConfigYaml {
  pagination: PaginationConfig[];
}

interface GraphQLResult {
  data: {
    configYaml: ConfigYaml;
  };
}

export const itemsPerPageForIndexPageName = async (
  indexName: string, 
  graphql: any
): Promise<number> => {
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

  const filteredPagination = pagination.filter((item: PaginationConfig) => item.indexName === indexName);

  if (filteredPagination.length === 0) {
    console.debug(
      `No pagination config with the index name "${indexName}" was found. Returns 8 by default.`,
    );
    return 8;
  } else {
    if (filteredPagination.length > 1) {
      console.debug(
        `Multiple pagination config with the index name "${indexName}" were found: ${filteredPagination}. Returns the first one.`,
      );
    }
    return filteredPagination[0].itemsPerPage;
  }
};