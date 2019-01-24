const createPages = require(`./core/createPages`);
const onCreateNode = require(`./core/onCreateNode`);

exports.onCreateNode = (arg) => {
    onCreateNode(arg);
};

exports.createPages = (arg) => {
    createPages(arg);
};
