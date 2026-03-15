export default args => {
  if (args.children && args.children.props) {
    const childProps = args.children.props;
    const className = childProps.className || '';

    if (
      className === 'language-math' ||
      childProps.name === 'MathBlock'
    ) {
      return childProps;
    }
  }
};
