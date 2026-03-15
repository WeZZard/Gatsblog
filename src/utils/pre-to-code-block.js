export default args => {
  if (args.children && args.children.props) {
    const childProps = args.children.props;
    const className = childProps.className || '';

    if (
      className.startsWith('language-') ||
      childProps.name === 'code' ||
      (args.children.type && (
        args.children.type === 'code' ||
        (typeof args.children.type === 'function' && args.children.type.displayName === 'code')
      ))
    ) {
      const codeString = typeof childProps.children === 'string'
        ? childProps.children.trim()
        : '';
      const language = className ? className.replace('language-', '') : '';
      const metaProps = {};
      if (childProps.metastring) {
        childProps.metastring.split(' ').forEach(meta => {
          const [key, value] = meta.split('=');
          if (value) metaProps[key] = value.replace(/"/g, '');
          else metaProps[key] = true;
        });
      }
      return {
        codeString,
        language,
        ...metaProps,
      };
    }
  }
};
