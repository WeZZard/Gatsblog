import type { GatsbyNode } from "gatsby";
import path from "path";

// Import TypeScript page generation functions
import createPagesImpl from "./src/core/create-pages";

// Import legacy node creation functions (will be migrated later)
const legacyOnCreateNode = require("./legacy/core/on-create-node");
const legacySetFieldsOnGraphQLNodeType = require("./legacy/core/set-fields-on-graphql-node-type");

export const onCreateNode: GatsbyNode["onCreateNode"] = legacyOnCreateNode;

export const createPages: GatsbyNode["createPages"] = createPagesImpl;

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