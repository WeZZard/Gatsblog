module.exports = async (location, graphql) => {
    const {
        data: {
            configYaml: {
                pagination: paginations
            }
        }
    } = await graphql(`
        {
            configYaml {
                pagination {
                    location
                    itemsPerPage
                }
            }
        }
    `);

    const filteredPaginations = paginations.filter(_ => _.location === location);

    if (filteredPaginations.length === 0) {
        throw `No pagination info with the location "${location}" was found.`;
    } else if (filteredPaginations.length === 1) {
        return filteredPaginations[0].itemsPerPage;
    } else {
        throw `Multiple pagination info with the location "${location}" were found: ${filteredPaginations}`;
    }
};
