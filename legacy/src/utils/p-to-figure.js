export default args => {
  if (
    args.children &&
    args.children.props &&
    args.children.props.name &&
    args.children.props.name === 'figure'
  ) {
    const props = { ...args.children.props };
    delete props.parentName;
    delete props.name;
    delete props.components;
    return props;
  }
};
