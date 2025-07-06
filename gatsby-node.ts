import type { GatsbyNode } from "gatsby";
import path from "path";

// Import TypeScript implementations
import createPagesImpl from "./src/core/create-pages";
import onCreateNodeImpl from "./src/core/on-create-node";
import setFieldsOnGraphQLNodeTypeImpl from "./src/core/set-fields-on-graphql-node-type";

export const onCreateNode: GatsbyNode["onCreateNode"] = onCreateNodeImpl;

export const createPages: GatsbyNode["createPages"] = createPagesImpl;

export const setFieldsOnGraphQLNodeType: GatsbyNode["setFieldsOnGraphQLNodeType"] = setFieldsOnGraphQLNodeTypeImpl;

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