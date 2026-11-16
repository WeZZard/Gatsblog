export default args => {
  if (
    args.children &&
    args.children.props &&
    args.children.props.name &&
    args.children.props.name === 'img'
  ) {
    return { ...args.children.props };
  }
  if (
    args.children &&
    args.children.props &&
    args.children.props.name &&
    args.children.props.name === 'a' &&
    args.children.children &&
    args.children.children.props &&
    args.children.children.props.name &&
    args.children.children.props.name === 'img'
  ) {
    return { ...args.children.props };
  }
};
