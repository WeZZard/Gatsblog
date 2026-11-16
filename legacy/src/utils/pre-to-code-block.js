export default args => {
  if (
    // children is MDXTag
    args.children &&
    // MDXTag props
    args.children.props &&
    // if MDXTag is going to render a <code>
    args.children.props.name === 'code'
  ) {
    // we have a <pre><code> situation
    const {
      children: codeString,
      props: { className, ...props },
    } = args.children.props;

    return {
      codeString: codeString.trim(),
      language: className && className.split('-')[1],
      ...props,
    };
  }
};
