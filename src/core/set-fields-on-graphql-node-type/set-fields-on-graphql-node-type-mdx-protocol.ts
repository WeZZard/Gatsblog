import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
} from 'gatsby/graphql';

interface SetFieldsArgs {
  type: {
    name: string;
  };
  getNode: (id: string) => any;
}

export default async function setFieldsOnGraphQLNodeTypeMdxProtocol(args: SetFieldsArgs) {
  const { type, getNode } = args;

  if (type.name === 'Post' || type.name === 'Page') {
    return {
      isPublished: {
        type: GraphQLBoolean,
        resolve: (source: any) => {
          const parent = getNode(source.parent);
          return (
            parent?.frontmatter?.isPublished === undefined ||
            parent?.frontmatter?.isPublished === true
          );
        },
      },
      subtitle: {
        type: GraphQLString,
        resolve: (source: any) => {
          const parent = getNode(source.parent);
          if (parent?.frontmatter?.subtitle) {
            return parent.frontmatter.subtitle;
          }
          return '';
        },
      },
      lastModifiedTime: {
        type: GraphQLString,
        resolve: (source: any) => {
          const parent = getNode(source.parent);
          if (parent?.frontmatter?.lastModifiedTime) {
            return parent.frontmatter.lastModifiedTime;
          }
          return null;
        },
      },
      license: {
        type: GraphQLString,
        resolve: (source: any) => {
          const parent = getNode(source.parent);
          if (parent?.frontmatter?.license) {
            return parent.frontmatter.license;
          }
          return null;
        },
      },
      keywords: {
        type: new GraphQLList(GraphQLString),
        resolve: (source: any) => {
          const parent = getNode(source.parent);
          if (parent?.frontmatter?.keywords) {
            return parent.frontmatter.keywords;
          }
          return [];
        },
      },
    };
  }

  return {};
}