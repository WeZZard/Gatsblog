exports.onCreateNode = require(`./core/on-create-node`);

exports.createPages = require(`./core/create-pages`);

exports.setFieldsOnGraphQLNodeType = require('./core/set-fields-on-graphql-node-type');

// Add schema customization for Gatsby v5 compatibility
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  
  // Define custom node types explicitly for Gatsby v5
  const typeDefs = `
    type Post implements Node {
      id: ID!
      title: String!
      createdTime: Date! @dateformat
      isLocalized: Boolean!
      lang: String!
      slug: String!
      file: File @link(by: "relativePath")
    }
    
    type Page implements Node {
      id: ID!
      title: String!
      createdTime: Date! @dateformat
      isLocalized: Boolean!
      lang: String!
      slug: String!
      file: File @link(by: "relativePath")
    }
    
    type Tag implements Node {
      id: ID!
      name: String!
      slug: String!
    }
    
    type Category implements Node {
      id: ID!
      name: String!
      slug: String!
    }
    
    type Locale implements Node {
      id: ID!
      identifier: String!
      name: String!
    }
  `;
  
  createTypes(typeDefs);
};

// Configure webpack to exclude Node.js modules from browser bundle
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        assert: false,
        util: false,
        stream: false,
        buffer: false,
        'object.assign/polyfill': require.resolve('./object-assign-polyfill.js'),
      },
    },
  });
};
