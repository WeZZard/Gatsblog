exports.onCreateNode = require(`./core/on-create-node`);

exports.createPages = require(`./core/create-pages`);

exports.setFieldsOnGraphQLNodeType = require('./core/set-fields-on-graphql-node-type');

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type Post implements Node {
      id: ID!
      title: String
      createdTime: Date @dateformat
      isLocalized: Boolean
      lang: String
      slug: String
      file: String
      category: String
      tags: [String]
    }

    type Category implements Node {
      id: ID!
      name: String
      slug: String
    }

    type Tag implements Node {
      id: ID!
      name: String
      slug: String
    }

    type Locale implements Node {
      id: ID!
      code: String
      name: String
    }

    type Page implements Node {
      id: ID!
      title: String
      createdTime: Date @dateformat
      isLocalized: Boolean
      lang: String
      slug: String
      file: String
    }
  `;
  createTypes(typeDefs);
};
