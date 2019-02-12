const visit = require(`unist-util-visit`);
const remarkMath = require(`remark-math`);

module.exports = ({ markdownAST }, pluginOptions = {}) => {
    visit(markdownAST, `inlineMath`, node => {
        node.type = `html`;
        node.value = `<InlineMath>{"${node.value}"}</InlineMath>`
    });

    visit(markdownAST, `math`, node => {
        node.type = `html`;
        node.value = `<Math>{"${node.value}"}</Math>`
    })
};

module.exports.setParserPlugins = () => [remarkMath];
