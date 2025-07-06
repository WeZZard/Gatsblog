import setFieldsOnGraphQLNodeTypePost from './set-fields-on-graphql-node-type-post';
import setFieldsOnGraphQLNodeTypeMdxProtocol from './set-fields-on-graphql-node-type-mdx-protocol';

interface SetFieldsArgs {
  type: {
    name: string;
  };
  getNode: (id: string) => any;
}

export default async function setFieldsOnGraphQLNodeType(args: SetFieldsArgs) {
  let result = {};

  const partial = await Promise.all([
    setFieldsOnGraphQLNodeTypePost(args),
    setFieldsOnGraphQLNodeTypeMdxProtocol(args),
  ]);

  partial.forEach(each => Object.assign(result, each));

  return result;
}