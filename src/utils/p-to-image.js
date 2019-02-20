export default args => {
  if (args.children && args.children.type && args.children.type === 'img') {
    return { ...args.children.props };
  }
};
