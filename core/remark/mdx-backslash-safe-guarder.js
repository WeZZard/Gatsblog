const visit = require('unist-util-visit');

const nodeTypes = ['text', 'code', 'inlineCode', 'math', 'inlineMath'];

module.exports = () => {
  return tree =>
    visit(tree, nodeTypes, node => {
      if (/\\/.test(node.value)) {
        node.value = node.value.replace(/\\/g, '\\\\');
      }
    });
};
