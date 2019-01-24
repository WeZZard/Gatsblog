const _getHomePageTitle = (index) => {
    if (index === 0) {
        return null
    }
    return `All Posts (Page ${index})`
};

module.exports = {
    getHomePageTitle: _getHomePageTitle,
};