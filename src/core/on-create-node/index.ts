import onCreateMdxDocuments from './on-create-mdx-documents';
import onCreateConfigYaml from './on-create-config-yaml';

interface OnCreateNodeArgs {
  node: any;
  actions: any;
  getNode: (id: string) => any;
  getNodesByType: (type: string) => any[];
  createNodeId: (id: string) => string;
  createContentDigest: (content: string) => string;
}

export default function onCreateNode(args: OnCreateNodeArgs): void {
  // Process MDX documents (Posts and Pages)
  onCreateMdxDocuments(args);
  
  // Process Config YAML files
  onCreateConfigYaml(args);
}