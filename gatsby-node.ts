import type { GatsbyNode } from "gatsby";
import path from "path";

// Import legacy node creation functions
const legacyOnCreateNode = require("./legacy/core/on-create-node");
const legacyCreatePages = require("./legacy/core/create-pages");
const legacySetFieldsOnGraphQLNodeType = require("./legacy/core/set-fields-on-graphql-node-type");

export const onCreateNode: GatsbyNode["onCreateNode"] = legacyOnCreateNode;

export const createPages: GatsbyNode["createPages"] = legacyCreatePages;

export const setFieldsOnGraphQLNodeType: GatsbyNode["setFieldsOnGraphQLNodeType"] = legacySetFieldsOnGraphQLNodeType;

// Enable GraphQL type generation for better TypeScript support
export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  });
};