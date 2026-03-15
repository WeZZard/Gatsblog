const visit = require('unist-util-visit');

const wrapMdxTags = markdownAST => {
  visit(markdownAST, `inlineMath`, node => {
    node.type = `html`;
    node.value = `<span class="math math-inline"><InlineMath math={"${node.value.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"} /></span>`;
  });

  visit(markdownAST, `math`, node => {
    node.type = `html`;
    node.value = `<div class="math math-display"><MathBlock math={"${node.value.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"} /></div>`;
  });
};

module.exports = () => {
  return wrapMdxTags;
};
