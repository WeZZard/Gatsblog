const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

const _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

const _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const visitWithParents = require("unist-util-visit-parents");

const getDefinitions = require("mdast-util-definitions");

const path = require("path");

const isRelativeUrl = require("is-relative-url");

const _ = require("lodash");

const { fluid } = require("gatsby-plugin-sharp");

const cheerio = require("cheerio");

const slash = require("slash");

function visitor(node, ancestors) {
    console.log(node);
}

module.exports = function (args, pluginOptions) {
    const {
        files,
        markdownNode,
        markdownAST,
        pathPrefix,
        getNode,
        reporter,
        cache,
    } = args;

    visitWithParents(markdownAST, 'break', visitor)
};
