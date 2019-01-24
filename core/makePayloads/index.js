const makeCategoryPayloadByNodeID = require('./makeCategoryPayloadByNodeID');
const makePostExcerptPayloadWithPost = require('./makePostExcerptPayloadWithPost');
const makeTagPayloadByNodeID = require('./makeTagPayloadByNodeID');
const makeTagSummaryPayloadWithTag = require('./makeTagSummaryPayloadWithTag');

module.exports = {
    makeCategoryPayloadByNodeID: makeCategoryPayloadByNodeID,
    makePostExcerptPayloadWithPost: makePostExcerptPayloadWithPost,
    makeTagPayloadByNodeID: makeTagPayloadByNodeID,
    makeTagSummaryPayloadWithTag: makeTagSummaryPayloadWithTag,
};
