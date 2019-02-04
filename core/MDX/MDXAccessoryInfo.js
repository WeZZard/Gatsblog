const assert = require('assert');
const remark = require('remark');
const visit = require('unist-util-visit');

function imageVisitor(node, userInfo) {
    assert(node.type === 'image');
    userInfo.push({
        src: node.url,
        title: node.title || '',
        alt: node.alt || '',
    });
}

module.exports = function(args) {
    const { node } = args;

    const markdownAst = remark.parse(node.rawBody);

    let images = [];

    visit(markdownAst, 'image', (node) => imageVisitor(node, images));

    return {
        images,
    }
};
