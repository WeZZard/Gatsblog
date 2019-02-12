const visit = require(`unist-util-visit`);

const wrapMdxTags = (markdownAST) => {
    visit(markdownAST, `inlineMath`, node => {
        node.type = `html`;
        node.value = `<InlineMath>{"${node.value}"}</InlineMath>`
    });

    visit(markdownAST, `math`, node => {
        node.type = `html`;
        node.value = `<Math>{"${node.value}"}</Math>`
    })
};

module.exports = () => { return wrapMdxTags };
