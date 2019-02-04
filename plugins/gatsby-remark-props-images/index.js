"use strict";

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

// If the image is relative (not hosted elsewhere)
// 1. Find the image file
// 2. Find the image's size
// 3. Filter out any responsive image fluid sizes that are greater than the image's width
// 4. Create the responsive images.
// 5. Set the html w/ aspect ratio helper.
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

  const defaults = {
    maxWidth: 650,
    pathPrefix: pathPrefix,
    withWebp: false
  };

  const options = _.defaults(pluginOptions, defaults);

  var findParentLinks = function findParentLinks(markdownNode) {
    var children = markdownNode.children;
    return children.some(function (node) {
      return node.type === "html" && !!node.value.match(/<a /) || node.type === "link";
    });
  }; // Get all the available definitions in the markdown tree


  var definitions = getDefinitions(markdownAST); // This will allow the use of html image tags
  // const rawHtmlNodes = select(markdownAST, `html`)

  var rawHtmlNodes = [];
  visitWithParents(markdownAST, "html", function (node, ancestors) {
    var inLink = ancestors.some(findParentLinks);
    rawHtmlNodes.push({
      node: node,
      inLink: inLink
    });
  }); // This will only work for markdown syntax image tags

  var markdownImageNodes = [];
  visitWithParents(markdownAST, ["image", "imageReference"], function (node, ancestors) {
    var inLink = ancestors.some(findParentLinks);
    markdownImageNodes.push({
      node: node,
      inLink: inLink
    });
  }); // Takes a node and generates the needed images and then returns
  // the needed HTML replacement for the image

  var generateImagesAndUpdateNode =
  /*#__PURE__*/
  function () {
    var _ref3 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(node, resolve, inLink, overWrites) {

      var parentNode,
          imagePath, imageNode, fluidResult, originalImg, fallbackSrc, srcSet,
          presentationWidth, srcSplit,
          fileName, fileNameNoExt,
          defaultAlt, alt, title, imageTag, webpFluidResult, ratio, rawHTML;

      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (overWrites === void 0) {
                overWrites = {};
              }

              // Check if this markdownNode has a File parent. This plugin
              // won't work if the image isn't hosted locally.
              parentNode = getNode(markdownNode.parent);

              if (!(parentNode && parentNode.dir)) {
                _context.next = 6;
                break;
              }

              imagePath = slash(path.join(parentNode.dir, node.url));
              _context.next = 7;
              break;

            case 6:
              return _context.abrupt("return", null);

            case 7:
              imageNode = _.find(files, function (file) {
                if (file && file.absolutePath) {
                  return file.absolutePath === imagePath;
                }

                return null;
              });

              if (!(!imageNode || !imageNode.absolutePath)) {
                _context.next = 10;
                break;
              }

              return _context.abrupt("return", resolve());

            case 10:
              _context.next = 12;
              return fluid({
                file: imageNode,
                args: options,
                reporter: reporter,
                cache: cache
              });

            case 12:
              fluidResult = _context.sent;

              if (fluidResult) {
                _context.next = 15;
                break;
              }

              return _context.abrupt("return", resolve());

            case 15:
              originalImg = fluidResult.originalImg;
              fallbackSrc = fluidResult.src;
              srcSet = fluidResult.srcSet;
              presentationWidth = fluidResult.presentationWidth; // Generate default alt tag

              srcSplit = node.url.split("/");
              fileName = srcSplit[srcSplit.length - 1];
              fileNameNoExt = fileName.replace(/\.[^/.]+$/, "");
              defaultAlt = fileNameNoExt.replace(/[^A-Z0-9]/gi, " ");
              alt = overWrites.alt ? overWrites.alt : node.alt ? node.alt : defaultAlt;
              title = node.title ? node.title : "";

              imageTag = (`<img alt="` + alt + `" title="` + title + `" src="` + fallbackSrc + `" srcset="` + srcSet + `" sizes="` + fluidResult.sizes + `"/>`).trim();

              // if options.withWebp is enabled, generate a webp version and change the image tag to a picture tag

              if (!options.withWebp) {
                _context.next = 34;
                break;
              }

              _context.next = 30;
              return fluid({
                file: imageNode,
                args: _.defaults({
                  toFormat: "WEBP"
                }, // override options if it's an object, otherwise just pass through defaults
                options.withWebp === true ? {} : options.withWebp, pluginOptions, defaults),
                reporter: reporter
              });

            case 30:
              webpFluidResult = _context.sent;

              if (webpFluidResult) {
                _context.next = 33;
                break;
              }

              return _context.abrupt("return", resolve());

            case 33:
              imageTag = (`<picture><source srcset="` + webpFluidResult.srcSet + `" sizes="` + webpFluidResult.sizes + `" type="` + webpFluidResult.srcSetType + `"/><source srcset="` + srcSet + `" sizes="` + fluidResult.sizes + `" type="` + fluidResult.srcSetType + `"/><img src="` + fallbackSrc + `" alt="` + alt + `" title="` + title + `"/></picture>`).trim();

            case 34:
              ratio = 1 / fluidResult.aspectRatio * 100 + "%"; // Construct new image node w/ aspect ratio placeholder

              rawHTML = imageTag;

              return _context.abrupt("return", rawHTML);

            case 40:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function generateImagesAndUpdateNode(_x, _x2, _x3, _x4) {
      return _ref3.apply(this, arguments);
    };
  }();

  return Promise.all( // Simple because there is no nesting in markdown
  markdownImageNodes.map(function (markdownImageNode) {
    var node = markdownImageNode.node;
    const inLink = markdownImageNode.inLink;

    return new Promise(
    /*#__PURE__*/
    function () {
      var _ref5 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(resolve, reject) {
        var overWrites, refNode, fileType, rawHTML;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                overWrites = {};

                if (!(!node.hasOwnProperty("url") && node.hasOwnProperty("identifier"))) {
                  _context2.next = 7;
                  break;
                }

                //consider as imageReference node
                refNode = node;
                node = definitions(refNode.identifier); // pass original alt from referencing node

                overWrites.alt = refNode.alt;

                if (node) {
                  _context2.next = 7;
                  break;
                }

                return _context2.abrupt("return", resolve());

              case 7:
                fileType = node.url.slice(-3); // Ignore gifs as we can't process them,
                // svgs as they are already responsive by definition

                if (!(isRelativeUrl(node.url) && fileType !== "gif" && fileType !== "svg")) {
                  _context2.next = 16;
                  break;
                }

                _context2.next = 11;
                return generateImagesAndUpdateNode(node, resolve, inLink, overWrites);

              case 11:
                rawHTML = _context2.sent;

                if (rawHTML) {
                  // Replace the image or ref node with an inline HTML node.
                  if (refNode) {
                    node = refNode;
                  }

                  node.type = "html";
                  node.value = rawHTML;
                }

                return _context2.abrupt("return", resolve(node));

              case 16:
                return _context2.abrupt("return", resolve());

              case 17:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x5, _x6) {
        return _ref5.apply(this, arguments);
      };
    }());
  })).then(function (markdownImageNodes) {
    return (// HTML image node stuff
      Promise.all( // Complex because HTML nodes can contain multiple images
      rawHtmlNodes.map(function (_ref6) {
        var node = _ref6.node,
            inLink = _ref6.inLink;
        return new Promise(
        /*#__PURE__*/
        function () {
          var _ref7 = (0, _asyncToGenerator2.default)(
          /*#__PURE__*/
          _regenerator.default.mark(function _callee3(resolve, reject) {
            var $, imageRefs, _i, thisImg, formattedImgTag, fileType, rawHTML;

            return _regenerator.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (node.value) {
                      _context3.next = 2;
                      break;
                    }

                    return _context3.abrupt("return", resolve());

                  case 2:
                    $ = cheerio.load(node.value);

                    if (!($("img").length === 0)) {
                      _context3.next = 5;
                      break;
                    }

                    return _context3.abrupt("return", resolve());

                  case 5:
                    imageRefs = [];
                    $("img").each(function () {
                      imageRefs.push($(this));
                    });
                    _i = 0;

                  case 8:
                    if (!(_i < imageRefs.length)) {
                      _context3.next = 29;
                      break;
                    }

                    thisImg = imageRefs[_i];
                    // Get the details we need.
                    formattedImgTag = {};
                    formattedImgTag.url = thisImg.attr("src");
                    formattedImgTag.title = thisImg.attr("title");
                    formattedImgTag.alt = thisImg.attr("alt");

                    if (formattedImgTag.url) {
                      _context3.next = 16;
                      break;
                    }

                    return _context3.abrupt("return", resolve());

                  case 16:
                    fileType = formattedImgTag.url.slice(-3); // Ignore gifs as we can't process them,
                    // svgs as they are already responsive by definition

                    if (!(isRelativeUrl(formattedImgTag.url) && fileType !== "gif" && fileType !== "svg")) {
                      _context3.next = 26;
                      break;
                    }

                    _context3.next = 20;
                    return generateImagesAndUpdateNode(formattedImgTag, resolve, inLink);

                  case 20:
                    rawHTML = _context3.sent;

                    if (!rawHTML) {
                      _context3.next = 25;
                      break;
                    }

                    // Replace the image string
                    thisImg.replaceWith(rawHTML);
                    _context3.next = 26;
                    break;

                  case 25:
                    return _context3.abrupt("return", resolve());

                  case 26:
                    _i++;
                    _context3.next = 8;
                    break;

                  case 29:
                    // Replace the image node with an inline HTML node.
                    node.type = "html";
                    node.value = $("body").html(); // fix for cheerio v1

                    return _context3.abrupt("return", resolve(node));

                  case 32:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, this);
          }));

          return function (_x7, _x8) {
            return _ref7.apply(this, arguments);
          };
        }());
      })).then(function (htmlImageNodes) {
        return markdownImageNodes.concat(htmlImageNodes).filter(function (node) {
          return !!node;
        });
      })
    );
  });
};