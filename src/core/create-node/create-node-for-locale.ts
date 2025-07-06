interface CreateNodeForLocaleArgs {
  locale: string;
  getNodesByType: (type: string) => any[];
  createNode: (nodeData: any) => void;
  createNodeId: (id: string) => string;
  createContentDigest: (data: any) => string;
}

interface LocaleData {
  identifier: string;
  slug: string;
}

// Simple locale pattern validation (e.g., en-US, zh-CN)
function isValidLocale(locale: string): boolean {
  const pattern = /^[a-z]{2}(-[A-Z]{2})?$/;
  return pattern.test(locale);
}

export function createNodeForLocale(args: CreateNodeForLocaleArgs): LocaleData {
  const {
    locale,
    getNodesByType,
    createNode,
    createNodeId,
    createContentDigest,
  } = args;

  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: "${locale}".`);
  }

  const localeData: LocaleData = { identifier: locale, slug: `/${locale}` };

  const existedNodes = getNodesByType('Locale').filter(
    (node: any) => node.identifier === localeData.identifier,
  );
  
  if (existedNodes.length === 1) {
    const node = existedNodes[0];
    if (node.identifier !== localeData.identifier) {
      throw new Error(`Duplicate locale "${node.identifier}".`);
    }
    console.debug(`Returns the data of existed locale node: ${node}`);
    return localeData;
  } else if (existedNodes.length === 0) {
    const nodeId = createNodeId(`locale-${locale}`);
    const nodeData = {
      ...localeData,
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: 'Locale',
        content: locale,
        contentDigest: createContentDigest(localeData.identifier),
      },
    };
    console.debug(`Create locale node: ${locale}`);
    createNode(nodeData);
    return localeData;
  } else {
    throw new Error(`Multiple locale nodes was found. ${existedNodes}`);
  }
}