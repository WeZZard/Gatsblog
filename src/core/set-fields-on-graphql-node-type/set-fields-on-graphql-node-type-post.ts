import { GraphQLString, GraphQLList } from 'gatsby/graphql';

interface SetFieldsArgs {
  type: {
    name: string;
  };
  getNode: (id: string) => any;
}

export default async function setFieldsOnGraphQLNodeTypePost(args: SetFieldsArgs) {
  const { type, getNode } = args;

  if (type.name === 'Post') {
    return {
      tags: {
        type: new GraphQLList(GraphQLString),
        resolve: (source: any) => {
          const parent = getNode(source.parent);
          if (parent?.frontmatter?.tags) {
            return parent.frontmatter.tags;
          }
          return [];
        },
      },
      category: {
        type: GraphQLString,
        resolve: (source: any) => {
          const parent = getNode(source.parent);
          if (parent?.frontmatter?.category) {
            return parent.frontmatter.category;
          }
          return 'Uncategorized';
        },
      },
    };
  }

  return {};
}