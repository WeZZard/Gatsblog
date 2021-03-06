export default (children, processors, rawStringProcessor) => {
  return children.map((child, index) => {
    if (child.props) {
      if (processors && child.props.name) {
        const processor = processors[child.props.name];
        if (processor) {
          return processor(child, index);
        }
      }
    } else {
      if (rawStringProcessor) {
        return rawStringProcessor(child, index);
      }
    }
    return child;
  });
};
