const assert = require('assert');

const getHomePageTitle = (locale, pageIndex) => {
    return pageIndex === 0 ? null : `All Posts (Page ${pageIndex})`;
};

const getHomePagePath = (locale, pageIndex) => {
    return pageIndex > 0 ? `/${pageIndex}` : `/`;
};

const getCategoryPageTitle = (categoryName, locale, pageIndex) => {
    return pageIndex === 0
        ? `${categoryName}`
        : `${categoryName} (Page ${pageIndex})`
};

const getCategoryPagePath = (categorySlug, locale, pageIndex) => {
    return pageIndex > 0 ? `${categorySlug}/${pageIndex}` : `${categorySlug}`;
};

const getTagPageTitle = (tagName, locale, pageIndex) => {
    return `Tag: ` + (pageIndex === 0 ? `${tagName}` : `${tagName} (Page ${pageIndex})`)
};

const getTagPagePath = (tagSlug, locale, pageIndex) => {
    return pageIndex > 0 ? `${tagSlug}/${pageIndex}` : `${tagSlug}`;
};

module.exports = {
    getHomePageTitle: getHomePageTitle,
    getHomePagePath: getHomePagePath,
    getCategoryPageTitle: getCategoryPageTitle,
    getCategoryPagePath: getCategoryPagePath,
    getTagPageTitle: getTagPageTitle,
    getTagPagePath: getTagPagePath,
};